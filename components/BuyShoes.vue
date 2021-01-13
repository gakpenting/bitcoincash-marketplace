<template>
  <!-- component -->
  <div>
    <div
      class="w-full content-center flex flex-wrap justify-center items-center"
    >
      <h1 class="uppercase font-bold text-2xl mt-10">
        used shoes marketplace
      </h1>
    </div>
    <div
      class="w-screen overflow-hidden flex justify-center content-center items-center"
    >
      <div v-for="i in 5" :key="i" class="container max-w-sm p-4 sm:w-1/2">
        <div
          class="card flex flex-col justify-center p-10 bg-white rounded-lg shadow-2xl"
        >
          <div class="prod-title">
            <p class="text-2xl uppercase text-gray-900 font-bold">Puma Shoes</p>
            <p class="uppercase text-sm text-gray-400">
              The best shoes in the marketplace
            </p>
          </div>
          <div class="prod-img">
            <img
              src="https://unsplash.com/photos/IJjfPInzmdk/download?force=true&w=1920"
              class="w-full object-cover object-center"
            />
          </div>
          <div class="prod-info grid gap-10">
            <div>
              <ul class="flex flex-row justify-center items-center">
                <li class="mr-4 last:mr-0">
                  <span
                    class="block p-1 border-2 border-gray-500 rounded-full transition ease-in duration-300"
                  >
                    <a
                      href="#blue"
                      class="block w-6 h-6 bg-blue-900 rounded-full"
                    ></a>
                  </span>
                </li>
                <li class="mr-4 last:mr-0">
                  <span
                    class="block p-1 border-2 border-white hover:border-gray-500 rounded-full transition ease-in duration-300"
                  >
                    <a
                      href="#yellow"
                      class="block w-6 h-6 bg-yellow-500 rounded-full"
                    ></a>
                  </span>
                </li>
                <li class="mr-4 last:mr-0">
                  <span
                    class="block p-1 border-2 border-white hover:border-gray-500 rounded-full transition ease-in duration-300"
                  >
                    <a
                      href="#red"
                      class="block w-6 h-6 bg-red-500 rounded-full"
                    ></a>
                  </span>
                </li>
                <li class="mr-4 last:mr-0">
                  <span
                    class="block p-1 border-2 border-white hover:border-gray-500 rounded-full transition ease-in duration-300"
                  >
                    <a
                      href="#green"
                      class="block w-6 h-6 bg-green-500 rounded-full"
                    ></a>
                  </span>
                </li>
              </ul>
            </div>
            <div
              class="flex flex-col md:flex-row justify-between items-center text-gray-900"
            >
              <p class="font-bold text-xl">65 $</p>
              <button
                class="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


