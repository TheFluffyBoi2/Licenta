const Navbar = () => {
  return (
    <div class="px-2 py-2">
      <nav class="bg-[#333] rounded-2xl text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div class="flex items-center space-x-5">
          <span>
            <img src="/logo.ico" alt="Vidb Games" class="w-10 h-10 shadow-lg" />
          </span>
          <div class="h-8 w-px bg-gray-500 items-center" />
          <span class="hover:text-white cursor-pointer">
            <a
              href="#"
              class="flex p-2 bg-[#444] rounded-full hover:bg-[#666] transition"
            >
              <img
                src="/users-solid-full.svg"
                alt="Users"
                class="w-6 h-6 invert"
              />
            </a>
          </span>
        </div>
        <div class="flex items-center space-x-5">
          <a
            href="#"
            class="flex p-2 bg-[#444] rounded-full hover:bg-[#666] transition"
          >
            <img
              src="/right-from-bracket-solid-full.svg"
              alt="Exit"
              class="w-6 h-6 invert"
            />
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
