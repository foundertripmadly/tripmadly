import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.png";

export default function Logo({ size = 50 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center leading-none">
      
      {/* Logo Image */}
      <Image
        src={logo}
        alt="TripMadly"
        width={size}
        height={size}
        className="object-contain"
      />

      {/* Text */}
      <span className="ml-1 text-[26px] font-bold tracking-tight leading-none">
        <span className="text-[#5A2DFF]">TRIP</span>
        <span className="text-black">MADLY</span>
      </span>

    </Link>
  );
}