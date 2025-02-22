import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-900">GC Elections</h1>
        <Image src="/gymkhana.png" alt="Gymkhana Logo" width={60} height={60} />
      </div>
    </nav>
  )
}
