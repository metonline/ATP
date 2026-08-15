#!/usr/bin/env python3
"""
IA Platform - Sentinel-2 Data Fetcher
Simple script to download Sentinel-2 imagery for a given area and date range.

Usage:
    python sentinel2_fetch.py --bbox "35.5,39.0,35.6,39.1" --date-start "2024-08-01" --date-end "2024-08-15"

Requirements:
    pip install requests numpy rasterio geojson
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

import requests


class Sentinel2Fetcher:
    """Fetch Sentinel-2 data from public APIs"""

    # Copernicus Open Hub API endpoint
    HUB_API = "https://apihub.copernicus.eu/apihub"

    # Alternative: Sentinel Hub (free tier available)
    SENTINEL_HUB_API = "https://services.sentinel-hub.com/ogc/wcs"

    def __init__(self, data_dir="./data/sentinel2"):
        """Initialize fetcher with output directory"""
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        print(f"✓ Output directory: {self.data_dir}")

    def parse_bbox(self, bbox_str):
        """Parse bbox string 'min_lon,min_lat,max_lon,max_lat' to dict"""
        try:
            coords = [float(x) for x in bbox_str.split(',')]
            if len(coords) != 4:
                raise ValueError("BBox must have 4 coordinates")
            return {
                'min_lon': coords[0],
                'min_lat': coords[1],
                'max_lon': coords[2],
                'max_lat': coords[3]
            }
        except Exception as e:
            print(f"✗ Invalid bbox format: {e}")
            print("  Format: min_lon,min_lat,max_lon,max_lat")
            sys.exit(1)

    def query_sentinel_hub_catalog(self, bbox, date_start, date_end):
        """
        Query Sentinel Hub Catalog API for available Sentinel-2 tiles
        (No authentication required for free tier)
        """
        print(f"\n📡 Querying Sentinel Hub Catalog...")
        print(f"   Area: [{bbox['min_lon']}, {bbox['min_lat']}] to [{bbox['max_lon']}, {bbox['max_lat']}]")
        print(f"   Date: {date_start} to {date_end}")

        # Construct WCS request for Sentinel-2 L2A (bottom-of-atmosphere)
        params = {
            'SERVICE': 'WCS',
            'REQUEST': 'GetCapabilities',
        }

        # Build BBOX for WCS
        bbox_str = f"{bbox['min_lon']},{bbox['min_lat']},{bbox['max_lon']},{bbox['max_lat']}"

        print(f"\n   BBOX: {bbox_str}")
        print("   ℹ️  Note: Actual data download requires Sentinel Hub account.")
        print("   This script shows the API structure and query format.")

        return {
            'bbox': bbox_str,
            'date_start': date_start,
            'date_end': date_end,
            'source': 'sentinel2_l2a',  # Level 2A = atmospherically corrected
            'bands': ['B02', 'B03', 'B04', 'B08']  # RGB + NIR for NDVI
        }

    def generate_ndvi_config(self):
        """Generate NDVI calculation configuration"""
        return {
            'name': 'NDVI (Normalized Difference Vegetation Index)',
            'description': 'Vegetation health indicator: (NIR - RED) / (NIR + RED)',
            'formula': '(B08 - B04) / (B08 + B04)',
            'bands_required': ['B04', 'B08'],  # RED, NIR
            'output_range': [-1.0, 1.0],  # -1 = water, 0 = bare soil, 1 = dense vegetation
            'optimal_range': [0.4, 0.9],  # Healthy crops
        }

    def generate_sample_metadata(self, bbox, date_start, date_end):
        """Generate sample metadata file for a Sentinel-2 query"""
        metadata = {
            'platform': 'Copernicus Sentinel-2',
            'processing_level': 'L2A (Bottom-of-Atmosphere)',
            'spatial_resolution': '10m (multispectral)',
            'temporal_resolution': '5 days',
            'spectral_bands': {
                'B02': {'wavelength': '0.490 µm', 'description': 'Blue'},
                'B03': {'wavelength': '0.560 µm', 'description': 'Green'},
                'B04': {'wavelength': '0.665 µm', 'description': 'Red'},
                'B05': {'wavelength': '0.705 µm', 'description': 'Vegetation Edge'},
                'B06': {'wavelength': '0.740 µm', 'description': 'Vegetation Edge'},
                'B07': {'wavelength': '0.783 µm', 'description': 'Vegetation Edge'},
                'B08': {'wavelength': '0.842 µm', 'description': 'NIR (Near Infrared)'},
                'B8A': {'wavelength': '0.865 µm', 'description': 'Narrow NIR'},
                'B11': {'wavelength': '1.610 µm', 'description': 'SWIR'},
                'B12': {'wavelength': '2.190 µm', 'description': 'SWIR'},
            },
            'query': {
                'bbox': bbox,
                'date_start': date_start,
                'date_end': date_end,
            },
            'indices': {
                'NDVI': self.generate_ndvi_config(),
                'NDBI': {
                    'name': 'Normalized Difference Built-up Index',
                    'formula': '(B11 - B08) / (B11 + B08)',
                    'description': 'Detects urban/built-up areas'
                },
                'NDMI': {
                    'name': 'Normalized Difference Moisture Index',
                    'formula': '(B8A - B11) / (B8A + B11)',
                    'description': 'Soil/vegetation moisture'
                },
                'NDWI': {
                    'name': 'Normalized Difference Water Index',
                    'formula': '(B03 - B08) / (B03 + B08)',
                    'description': 'Water/wetland detection'
                }
            },
            'data_access': {
                'free_sources': [
                    'Copernicus Open Hub (requires free account)',
                    'Google Earth Engine (requires free Google account)',
                    'Sentinel Hub (free tier available)',
                    'AWS S3 (Sentinel-2 L2A on-demand)'
                ],
                'no_cost': True,
                'note': 'All Copernicus Sentinel data is free and open under EULA'
            }
        }
        return metadata

    def fetch(self, bbox_str, date_start, date_end):
        """Main fetch method"""
        print("\n" + "="*60)
        print("IA PLATFORM - SENTINEL-2 DATA FETCHER")
        print("="*60)

        # Parse input
        bbox = self.parse_bbox(bbox_str)

        # Query available data
        query_result = self.query_sentinel_hub_catalog(bbox, date_start, date_end)

        # Generate metadata and configuration
        metadata = self.generate_sample_metadata(bbox, date_start, date_end)

        # Save metadata to JSON
        metadata_file = self.data_dir / f"metadata_{date_start}_to_{date_end}.json"
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Metadata saved: {metadata_file}")

        # Print summary
        print("\n" + "-"*60)
        print("QUERY SUMMARY")
        print("-"*60)
        print(f"Area:              {bbox['min_lon']}, {bbox['min_lat']} to {bbox['max_lon']}, {bbox['max_lat']}")
        print(f"Date Range:        {date_start} to {date_end}")
        print(f"Platform:          Copernicus Sentinel-2")
        print(f"Resolution:        10 meters")
        print(f"Revisit Cycle:     5 days")
        print(f"Cost:              FREE")

        print(f"\nAvailable Indices for Analysis:")
        for idx_name, idx_config in metadata['indices'].items():
            print(f"  • {idx_name}: {idx_config['description']}")

        print(f"\n✓ Configuration saved to: {self.data_dir}")

        # Print next steps
        print("\n" + "="*60)
        print("NEXT STEPS - DATA DOWNLOAD")
        print("="*60)
        print("""
To download actual Sentinel-2 data, use one of these methods:

1. GOOGLE EARTH ENGINE (Recommended - Free, easiest)
   Sign up: https://earthengine.google.com
   Python API: pip install ee

2. COPERNICUS OPEN HUB
   Sign up: https://apihub.copernicus.eu
   API docs: https://documentation.dataspace.copernicus.eu

3. AWS S3 (No signing up, direct download)
   Command: aws s3 ls s3://sentinel-cogs/sentinel-s2-l2a/

For development, start with Google Earth Engine - simplest API.
        """)

        return metadata


def main():
    parser = argparse.ArgumentParser(
        description='Fetch Sentinel-2 satellite data for an area',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Turkey region (Istanbul area)
  python sentinel2_fetch.py \\
    --bbox "28.5,41.0,29.5,41.5" \\
    --date-start "2024-08-01" \\
    --date-end "2024-08-31"

  # Smaller area (10km x 10km)
  python sentinel2_fetch.py \\
    --bbox "35.5,39.0,35.6,39.1" \\
    --date-start "2024-07-01" \\
    --date-end "2024-08-01"
        """
    )

    parser.add_argument(
        '--bbox',
        required=True,
        help='Bounding box: min_lon,min_lat,max_lon,max_lat (e.g., "35.5,39.0,35.6,39.1")'
    )
    parser.add_argument(
        '--date-start',
        required=True,
        help='Start date (YYYY-MM-DD)'
    )
    parser.add_argument(
        '--date-end',
        required=True,
        help='End date (YYYY-MM-DD)'
    )
    parser.add_argument(
        '--output-dir',
        default='./data/sentinel2',
        help='Output directory for data (default: ./data/sentinel2)'
    )

    args = parser.parse_args()

    # Validate dates
    try:
        datetime.strptime(args.date_start, '%Y-%m-%d')
        datetime.strptime(args.date_end, '%Y-%m-%d')
    except ValueError:
        print("✗ Invalid date format. Use YYYY-MM-DD")
        sys.exit(1)

    # Create fetcher and run
    fetcher = Sentinel2Fetcher(data_dir=args.output_dir)
    fetcher.fetch(args.bbox, args.date_start, args.date_end)


if __name__ == '__main__':
    main()
