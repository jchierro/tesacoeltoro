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
        "alt": "Rome desayunando en una terraza mientras sostiene una paloma.",
        "caption": "Rome negocia con la paloma barista para conseguir café infinito y wifi en la terraza.",
    },
    {
        "alt": "Rome preparando un avión de papel desde la ventana de una oficina moderna.",
        "caption": "Rome lanza el informe trimestral en avión de papel para ahorrar en presentaciones de PowerPoint.",
    },
    {
        "alt": "Rome recostado dentro de un ataúd durante un ensayo teatral.",
        "caption": "Rome prueba la siesta eterna premium antes de firmar el contrato con la funeraria boutique.",
    },
    {
        "alt": "Rome dormido en el asiento trasero de un coche con el cinturón abrochado.",
        "caption": "Rome activa el modo avión humano y se queda dormido antes de que el GPS diga recalculando.",
    },
    {
        "alt": "Rome en silla de ruedas con la pierna escayolada acompañado a la salida de un hospital.",
        "caption": "Rome presume de escayola con purpurina tras intentar torear una impresora 3D industrial.",
    },
    {
        "alt": "Rome vestido de torero posando en la plaza junto a una amiga.",
        "caption": "Rome luce traje de luces justo antes de torear la reunión anual de recursos humanos.",
    },
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

    print("Galería actualizada con", len(DESCRIPTIONS), "imágenes en base64.")


if __name__ == "__main__":
    main()
