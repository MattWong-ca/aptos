import { useRef, useEffect } from "react";
import "./Card.css";

const useGlossEffect = (cardRef: React.RefObject<HTMLDivElement>, cardContentRef: React.RefObject<HTMLDivElement>, glossRef: React.RefObject<HTMLDivElement>) => {
  const mapNumberRange = (n: number, a: number, b: number, c: number, d: number) => {
    return ((n - a) * (d - c)) / (b - a) + c;
  };

  const addShineClass = () => {
    requestAnimationFrame(() => {
      glossRef!.current!.classList.add("gloss--shine");
    });
  };

  const calculateTransformValues = (pointerX: number, pointerY: number, cardRect: DOMRect) => {
    const halfWidth = cardRect.width / 2;
    const halfHeight = cardRect.height / 2;
    const cardCenterX = cardRect.left + halfWidth;
    const cardCenterY = cardRect.top + halfHeight;
    const deltaX = pointerX - cardCenterX;
    const deltaY = pointerY - cardCenterY;
    const distanceToCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = Math.max(halfWidth, halfHeight);
    const degree = mapNumberRange(distanceToCenter, 0, maxDistance, 0, 10);
    const rx = mapNumberRange(deltaY, 0, halfWidth, 0, 1);
    const ry = mapNumberRange(deltaX, 0, halfHeight, 0, 1);
    return { rx, ry, degree, distanceToCenter, maxDistance };
  };

  const applyTransform = (rx: number, ry: number, degree: number, distanceToCenter: number, maxDistance: number) => {
    const cardTransform = `perspective(400px) rotate3d(${-rx}, ${ry}, 0, ${degree}deg)`;
    const glossTransform = `translate(${-ry * 100}%, ${-rx * 100}%) scale(2.4)`;
    const glossOpacity = mapNumberRange(distanceToCenter, 0, maxDistance, 0, 0.6);

    cardContentRef!.current!.style.transform = cardTransform;
    glossRef!.current!.style.transform = glossTransform;
    glossRef!.current!.style.opacity = glossOpacity.toString();
  };

  const handleMouseMove = ({ clientX, clientY }: { clientX: number; clientY: number }) => {
    const card = cardRef.current;
    const cardRect = card!.getBoundingClientRect();

    const { rx, ry, degree, distanceToCenter, maxDistance } = calculateTransformValues(
      clientX,
      clientY,
      cardRect
    );

    applyTransform(rx, ry, degree, distanceToCenter, maxDistance);
  };

  const handleMouseLeave = () => {
    cardContentRef.current!.style.transform = '';
    glossRef.current!.style.opacity = "0";
  };

  useEffect(() => {
    const card = cardRef.current;

    addShineClass();

    card!.addEventListener("mousemove", handleMouseMove);
    card!.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card!.removeEventListener("mousemove", handleMouseMove);
      card!.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cardRef, cardContentRef, glossRef]);
};

const HoverCard = () => {
  const cardRef = useRef(null);
  const cardContentRef = useRef(null);
  const glossRef = useRef(null);

  useGlossEffect(cardRef, cardContentRef, glossRef);

  return (
    <div className="card" ref={cardRef}>
      <div className="content" ref={cardContentRef}>
        <div className="gloss" ref={glossRef} />
        <img
          src="https://i.imgur.com/2C0ltvW.png"
          alt="NFT"
          style={{ border: '3px solid black', borderRadius: '10px' }}
        />
      </div>
    </div>
  );
};

export default HoverCard;
