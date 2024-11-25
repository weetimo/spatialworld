from pydantic import BaseModel
import numpy as np
import cv2
import base64
from typing import Optional

class HeatmapRequest(BaseModel):
    original_image_base64: str
    heatmap_base64: str
    alpha: float = 0.6

class HeatmapResponse(BaseModel):
    success: bool
    overlay_image: Optional[str] = None
    error: Optional[str] = None

class HeatmapService:
    @staticmethod
    def base64_to_numpy(base64_str: str) -> np.ndarray:
        """Convert base64 image to numpy array"""
        # Remove data URL prefix if present
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]

        # Decode base64 to bytes
        img_bytes = base64.b64decode(base64_str)

        # Convert to numpy array
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    @staticmethod
    def numpy_to_base64(img: np.ndarray) -> str:
        """Convert numpy array to base64 image"""
        # Convert RGB to BGR for OpenCV
        img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

        # Encode image
        _, buffer = cv2.imencode('.png', img_bgr)
        base64_str = base64.b64encode(buffer).decode('utf-8')
        return f"data:image/png;base64,{base64_str}"

    async def create_overlay(self, request: HeatmapRequest) -> HeatmapResponse:
        """Create heatmap overlay on original image"""
        try:
            # Convert base64 images to numpy arrays
            original_img = self.base64_to_numpy(request.original_image_base64)
            heatmap_img = self.base64_to_numpy(request.heatmap_base64)

            # Ensure images are the same size
            if original_img.shape[:2] != heatmap_img.shape[:2]:
                heatmap_img = cv2.resize(
                    heatmap_img,
                    (original_img.shape[1], original_img.shape[0]),
                    interpolation=cv2.INTER_LINEAR
                )

            # Create overlay
            overlay = cv2.addWeighted(
                original_img,
                1 - request.alpha,
                heatmap_img,
                request.alpha,
                0
            )

            # Convert result back to base64
            result_base64 = self.numpy_to_base64(overlay)

            return HeatmapResponse(
                success=True,
                overlay_image=result_base64
            )

        except Exception as e:
            return HeatmapResponse(
                success=False,
                error=str(e)
            )
