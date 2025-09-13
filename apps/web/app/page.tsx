import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col items-center relative bg-black min-h-screen text-white justify-center p-20">
      <div className="text-center space-y-10">
        <h1 className="font-semibold text-4xl ">Notpadd v3</h1>
        <p className="text-base">@skaleway</p>
      </div>
      <div className="absolute bottom-20">
        <Link href="/auth/login">Authenticate</Link>
      </div>
    </div>
  );
}
