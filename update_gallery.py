#!/usr/bin/env python3
from __future__ import annotations

import base64
import imghdr
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
INDEX_PATH = REPO_ROOT / "index.html"
ATTACHMENTS_DIR = Path("/tmp/user_uploaded_attachments")

DESCRIPTIONS = [
    {
        "alt": "Hombre desayunando mientras sostiene una paloma sobre la taza de café.",
        "caption": "Reunión creativa con la nueva consultora alada del departamento de marketing.",
    },
    {
        "alt": "Empleado lanzando un avión de papel desde una ventana de oficina.",
        "caption": "Presentación trimestral resumida en avión: KPIs volando directo al cliente.",
    },
    {
        "alt": "Persona recostada dentro de un ataúd durante un ensayo.",
        "caption": "Simulacro de siesta eterna para evaluar la comodidad del ataúd VIP con climatizador.",
    },
]

NEW_IMAGE_BASE64 = (
    "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAKklEQVR4nGP8/5+BFMRAKYAJRgZG"
    "QJYJxiqGiTECD2QkGqiCgwEAGmAFCxh4GGgAAAAASUVORK5CYII="
)

EXTRA_ITEMS = [
    {
        "alt": "Pixel art del jefe surfeando el caos corporativo en una tabla de informes.",
        "caption": (
            "Recreación oficial del simulacro de emergencia: el jefe montado en una tabla de "
            "Excel mientras grita '¡que nadie cierre el trimestre!'."
        ),
        "data_uri": f"data:image/png;base64,{NEW_IMAGE_BASE64}",
    }
]

def detect_mime(path: Path) -> str:
    detected = imghdr.what(path)
    if detected == "jpeg":
        return "image/jpeg"
    if detected:
        return f"image/{detected}"
    # Fallback to extension
    return "image/png" if path.suffix.lower() == ".png" else "application/octet-stream"


def image_to_data_uri(path: Path) -> str:
    mime = detect_mime(path)
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def build_figures(images: list[Path]) -> str:
    figure_blocks: list[str] = []
    for image_path, description in zip(images, DESCRIPTIONS):
        data_uri = image_to_data_uri(image_path)
        figure_blocks.append(
            "            <figure class=\"gallery-item\">\n"
            f"              <img src=\"{data_uri}\" alt=\"{description['alt']}\" />\n"
            f"              <span>{description['caption']}</span>\n"
            "            </figure>"
        )
    for extra in EXTRA_ITEMS:
        figure_blocks.append(
            "            <figure class=\"gallery-item\">\n"
            f"              <img src=\"{extra['data_uri']}\" alt=\"{extra['alt']}\" />\n"
            f"              <span>{extra['caption']}</span>\n"
            "            </figure>"
        )
    return "\n".join(figure_blocks)


def update_gallery_html(figures_markup: str) -> None:
    if not INDEX_PATH.exists():
        raise FileNotFoundError(f"No se encontró el archivo {INDEX_PATH}")

    content = INDEX_PATH.read_text(encoding="utf-8")
    pattern = re.compile(r"<div class=\"gallery-grid\">[\s\S]*?</div>\s*</div>\s*</section>")
    replacement = (
        "<div class=\"gallery-grid\">\n"
        f"{figures_markup}\n"
        "          </div>\n"
        "        </div>\n"
        "      </section>"
    )

    new_content, count = pattern.subn(replacement, content, count=1)
    if count == 0:
        raise ValueError("No se pudo actualizar la galería: patrón no encontrado.")

    INDEX_PATH.write_text(new_content, encoding="utf-8")


def main() -> None:
    if not ATTACHMENTS_DIR.exists():
        raise FileNotFoundError(
            f"No se encontró la carpeta de adjuntos en {ATTACHMENTS_DIR}."
        )

    images = sorted(ATTACHMENTS_DIR.glob("*"))
    if len(images) < len(DESCRIPTIONS):
        raise ValueError(
            "No hay suficientes imágenes adjuntas para completar la galería."
        )

    figures_markup = build_figures(images[: len(DESCRIPTIONS)])
    update_gallery_html(figures_markup)

    total_items = len(DESCRIPTIONS) + len(EXTRA_ITEMS)
    print("Galería actualizada con", total_items, "imágenes en base64.")


if __name__ == "__main__":
    main()
