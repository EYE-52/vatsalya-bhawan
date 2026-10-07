"""Preserve the space/India journey, then centre the real nadir view on Ram Mandir."""
from pathlib import Path
import argparse
import json
import math

import numpy as np
import render_continuous as continuous

TARGET = (26.7957774, 82.1942075)
FINAL_DISTANCE = 1.00039
DEFAULT_OUTPUT = continuous.geo.DEFAULT_WORK.parent / 'temple-centered-geographic'


def trajectory(t):
    if t < 8:
        return continuous.geo.trajectory(t)
    s = float(continuous.geo.ease((t - 8) / (continuous.ARRIVAL - 8)))
    lat, lon = [a + (b - a) * s for a, b in zip(continuous.geo.TARGET, TARGET)]
    altitude = math.exp(math.log(.045) * (1 - s) + math.log(FINAL_DISTANCE - 1) * s)
    return lat, lon, 1 + altitude


class Renderer(continuous.Renderer):
    def frame(self, t):
        # Reuse the complete registered-pixel pipeline without changing either
        # existing renderer. Rendering is sequential within each process.
        original = continuous.trajectory
        continuous.trajectory = trajectory
        try:
            return super().frame(t)
        finally:
            continuous.trajectory = original

    def endpoint(self):
        path = self.output / f'temple-centered-end{self.suffix}.jpg'
        frame = self.frame(continuous.ARRIVAL)
        frame.save(path, quality=100, subsampling=0)
        assert self.frame(continuous.DURATION - 1 / continuous.FPS) is frame
        (self.output / f'camera{self.suffix}.json').write_text(json.dumps({
            'target_lat_lon': TARGET, 'final_distance_earth_radii': FINAL_DISTANCE,
            'arrival_seconds': continuous.ARRIVAL, 'duration_seconds': continuous.DURATION,
            'dimensions': [self.width, self.height], 'source_detail_metres': 10,
            'view': 'north-up nadir; actual georeferenced Copernicus imagery',
        }, indent=2) + '\n')
        print(path, flush=True)


def check_geometry():
    continuous.geo.check_geometry()
    assert np.allclose(trajectory(12.5), (*TARGET, FINAL_DISTANCE))
    assert trajectory(15) == trajectory(12.5)
    assert np.allclose(trajectory(8 - 1e-6), trajectory(8 + 1e-6), atol=1e-6)
    assert np.all(np.diff([trajectory(t)[2] for t in np.linspace(8, 12.5, 1000)]) < 0)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument('--portrait', action='store_true')
    parser.add_argument('--frame-only', action='store_true')
    parser.add_argument('--preview', action='store_true')
    args = parser.parse_args()
    check_geometry()
    renderer = Renderer(args.output, args.portrait)
    renderer.endpoint()
    if args.preview:
        renderer.preview()
    elif not args.frame_only:
        renderer.render()
