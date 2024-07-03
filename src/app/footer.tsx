import { XIcon, Youtube ,  Linkedin, Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-cyan-800 to-blue-600">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link
              href="/"
              className="flex items-center"
            >
              <span className="hidden md:block self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                LoserLeague
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Follow me
              </h2>
              <ul className="text-white font-medium flex flex-col gap-4">
                <Link
                  href="https://x.com/dekamdev"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <XIcon /> @dekamdev
                </Link>
                <Link
                  href="https://github.com/mdekaa"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github /> @mdekaa 
                </Link>

                
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="text-white font-medium flex flex-col gap-4">
                <li>
                  <Link href="/privacy-policy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm sm:text-center text-white">
            © 2024{" "}
            <a
              href="/"
              className="hover:underline"
            >
              LoserLeague
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
