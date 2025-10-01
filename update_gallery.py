#!/usr/bin/env python3
from __future__ import annotations

import base64
import imghdr
import re
from dataclasses import dataclass, replace
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
INDEX_PATH = REPO_ROOT / "index.html"
ATTACHMENTS_DIR = Path("/tmp/user_uploaded_attachments")


@dataclass
class GalleryItem:
    alt: str
    caption: str
    data_uri: str


NEW_IMAGE_BASE64 = (
    "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAKklEQVR4nGP8/5+BFMRAKYAJRgZG"
    "QJYJxiqGiTECD2QkGqiCgwEAGmAFCxh4GGgAAAAASUVORK5CYII="
)

NEW_IMAGE_ITEM = GalleryItem(
    alt="Pixel art del jefe surfeando el caos corporativo en una tabla de informes.",
    caption=(
        "Recreación oficial del simulacro de emergencia: el jefe montado en una tabla de"
        " Excel mientras grita '¡que nadie cierre el trimestre!'."
    ),
    data_uri=f"data:image/png;base64,{NEW_IMAGE_BASE64}",
)

ATTACHMENT_METADATA = {
    "image_1": GalleryItem(
        alt=(
            "Empleado dormido en el asiento trasero del coche con el cinturón puesto y"
            " la cara pegada a una almohada improvisada."
        ),
        caption=(
            "Prueba piloto del nuevo servicio 'siesta express' para comerciales que"
            " cierran acuerdos incluso mientras roncan."
        ),
        data_uri="",
    ),
}


def create_attachment_item(path: Path, index: int) -> GalleryItem:
    key = path.stem
    base_item = ATTACHMENT_METADATA.get(
        key,
        GalleryItem(
            alt=f"Documento oficial de la hazaña {index} en pleno esplendor pixelado.",
            caption=(
                "El departamento de comunicación insiste en que esta foto resume la"
                f" jornada {index}: caos elegante y sonrisas en modo riesgo controlado."
            ),
            data_uri="",
        ),
    )
    return replace(base_item, data_uri=image_to_data_uri(path))

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


def build_figures(items: list[GalleryItem]) -> str:
    figure_blocks: list[str] = []
    for item in items:
        figure_blocks.append(
            "            <figure class=\"gallery-item\">\n"
            f"              <img src=\"{item.data_uri}\" alt=\"{item.alt}\" />\n"
            f"              <span>{item.caption}</span>\n"
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

    attachment_paths = sorted(ATTACHMENTS_DIR.glob("*"))
    if not attachment_paths:
        raise ValueError("No se encontraron imágenes adjuntas para convertir.")

    gallery_items = [
        create_attachment_item(path, index)
        for index, path in enumerate(attachment_paths, start=1)
    ]
    gallery_items.append(NEW_IMAGE_ITEM)

    figures_markup = build_figures(gallery_items)
    update_gallery_html(figures_markup)

    total_items = len(DESCRIPTIONS) + len(EXTRA_ITEMS)
    print("Galería actualizada con", total_items, "imágenes en base64.")



if __name__ == "__main__":
    main()
