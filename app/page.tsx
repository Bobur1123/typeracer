import Image from "next/image";
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex-column justify-center my-4 title ">
      <h1 className="text-center title">Challenge yourself...</h1>
      <div>
        <Image
          src="/car.png"
          alt="Moving Car"
          width={200}
          height={300}
          className="car"
        />
      </div>
      <div className="flex justify-center pt-32">
        <Link href="racer">        
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"  aria-label="Start the race">
          Start
        </button>
        </Link>

      </div>
    </div>
  );
}
