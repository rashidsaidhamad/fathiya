"use client";

import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaImages, FaTimes } from "react-icons/fa";

type PropertyGalleryViewerProps = {
  images: string[];
};

export default function PropertyGalleryViewer({ images }: PropertyGalleryViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeImages = images.filter((image) => typeof image === "string" && image.trim().length > 0);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key === "ArrowLeft") {
        setCurrentIndex((index) => (index === 0 ? safeImages.length - 1 : index - 1));
      }

      if (event.key === "ArrowRight") {
        setCurrentIndex((index) => (index + 1) % safeImages.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, safeImages.length]);

  function openGallery() {
    if (safeImages.length === 0) return;
    setCurrentIndex(0);
    setIsOpen(true);
  }

  function showPreviousImage() {
    setCurrentIndex((index) => (index === 0 ? safeImages.length - 1 : index - 1));
  }

  function showNextImage() {
    setCurrentIndex((index) => (index + 1) % safeImages.length);
  }

  if (safeImages.length === 0) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={openGallery}
        className="gallery-open-button"
        style={{
          background: "#111827",
          color: "#fff",
          textDecoration: "none",
          padding: "10px 16px",
          borderRadius: 999,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: "none",
          cursor: "pointer",
        }}
      >
        <FaImages /> Watch Gallery
      </button>

      {isOpen ? (
        <div
          onClick={() => setIsOpen(false)}
          className="gallery-modal"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5000,
            background: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="gallery-shell"
            style={{
              width: "min(100%, 980px)",
              background: "#0f172a",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
              display: "grid",
              gap: 0,
            }}
          >
            <div className="gallery-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", color: "#fff" }}>
              <div style={{ fontWeight: 700 }}>
                Image {currentIndex + 1} of {safeImages.length}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="gallery-close-button"
                style={{
                  border: "none",
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="gallery-stage" style={{ position: "relative", background: "#000" }}>
              <div
                style={{
                  width: "100%",
                  height: "min(70vh, 720px)",
                  backgroundImage: `url('${safeImages[currentIndex]}')`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />

              <button
                type="button"
                onClick={showPreviousImage}
                className="gallery-nav-button gallery-nav-button-left"
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255,255,255,0.14)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                onClick={showNextImage}
                className="gallery-nav-button gallery-nav-button-right"
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255,255,255,0.14)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </div>

            <div style={{ display: "grid", gap: 12, padding: 16, background: "#111827" }}>
              <div className="gallery-thumbs" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: 10 }}>
                {safeImages.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className="gallery-thumb-button"
                    style={{
                      border: index === currentIndex ? "2px solid var(--accent-dark)" : "2px solid transparent",
                      padding: 0,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  >
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "4 / 3",
                        backgroundImage: `url('${imageUrl}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .gallery-open-button {
          min-height: 44px;
          touch-action: manipulation;
        }

        .gallery-nav-button,
        .gallery-close-button,
        .gallery-thumb-button {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 768px) {
          .gallery-modal {
            align-items: flex-end !important;
            padding: 0 !important;
          }

          .gallery-shell {
            width: 100% !important;
            max-height: 100vh;
            border-radius: 18px 18px 0 0 !important;
          }

          .gallery-header {
            padding: 12px 14px !important;
            gap: 10px;
            align-items: flex-start !important;
          }

          .gallery-stage div:first-child {
            height: min(52vh, 420px) !important;
          }

          .gallery-nav-button {
            width: 44px !important;
            height: 44px !important;
          }

          .gallery-nav-button-left {
            left: 10px !important;
          }

          .gallery-nav-button-right {
            right: 10px !important;
          }

          .gallery-thumbs {
            display: flex !important;
            gap: 10px !important;
            overflow-x: auto;
            padding-bottom: 4px;
            scroll-snap-type: x mandatory;
          }

          .gallery-thumb-button {
            min-width: 88px;
            flex: 0 0 88px;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </>
  );
}