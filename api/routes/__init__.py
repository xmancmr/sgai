from flask import Blueprint
from .predictions import bp as predictions_bp
from .report import bp as report_bp

__all__ = ["predictions_bp", "report_bp"]
