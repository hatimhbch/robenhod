import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import type { Component } from 'solid-js';
import logo from "/logo.svg";

const Nav: Component = () => {
  const [isLinksVisible, setIsLinksVisible] = createSignal(false);
  const [isHovered, setIsHovered] = createSignal(false);

  return (
    <>
    <p class={`${isLinksVisible() ? 'sm:block h-40' : 'sm:hidden h-0'} absolute w-full bg-white border-b border-solid border-neutral-100 sm:block dark:bg-black dark:border-neutral-900`}></p>
    <nav class="flex absolute top-0 left-0 w-full h-[72px] px-20 bg-white justify-between border-b border-solid border-neutral-50 dark:border-neutral-900 dark:bg-black sm:px-5">
      <div class="flex w-auto justify-between pl-2">
        <A class="flex" href="/"><img class="w-8 sm:w-9 my-auto dark:invert" src={logo} alt="logo" /><p class="items-center my-auto pb-[2px] ml-1 text-base font-manrope font-semibold sm:hidden">robenhod</p></A>
      </div>
      <svg class="bar hidden w-9 fill-neutral-900 items-center dark:fill-white sm:block" onClick={() => setIsLinksVisible(!isLinksVisible())} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 36 36"><rect y="12" width="25" height="1.7"></rect><rect y="22" width="25" height="1.7"></rect></svg>
      <div class={`flex w-[430px] justify-between ${isLinksVisible() ? 'sm:flex' : 'sm:hidden'} sm:absolute sm:top-36 sm:left-1/2 sm:translate-x-[-50%]`}>
        <div class={`flex gap-x-6 my-auto ${isLinksVisible() ? 'sm:flex' : 'sm:hidden'} ease-linear sm:absolute sm:-top-10 sm:left-1/2 relative sm:ml-0 sm:translate-x-[-50%]`}>
          <A class="text-[14px] text-neutral-950 font-medium font-montserrat dark:text-neutral-400 tracking-normal" href="/" end>Products</A>
          <A class="text-[14px] text-neutral-950 font-medium font-montserrat dark:text-neutral-400 tracking-normal" href="/" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            Categories
            <div class="absolute top-10 w-[360px] p-4 bg-white dark:bg-black border border-solid border-neutral-100 dark:border-neutral-950 overflow-hidden transition-shadow duration-400 ease-in-out rounded-md" style={{ display: isHovered() ? 'block' : 'none' }}>
              <p class="text-xs text-neutral-900 dark:text-neutral-50 font-semibold">Top Categories</p>
              <div class="w-full flex flex-wrap pt-3 justify-between">
                <div class="block w-[163px]">
                  <p class="text-neutral-700 dark:text-neutral-200 text-xs font-manrope py-1">Web Development</p>
                  <p class="text-neutral-700 dark:text-neutral-200 text-xs font-manrope py-1">App Development</p>
                </div>
                <div class="block w-[163px]">
                  <p class="text-neutral-700 dark:text-neutral-200 text-xs font-manrope py-1">Ai</p>
                  <p class="text-neutral-700 dark:text-neutral-200 text-xs font-manrope py-1">Creative</p>
                </div>
              </div>
            </div>
          </A>
          <A class="text-[14px] text-neutral-950 font-medium font-montserrat dark:text-neutral-400 tracking-normal" href="/">Topics</A>
          <A class="text-[14px] text-neutral-950 font-medium font-montserrat dark:text-neutral-400 tracking-normal" href="/">About</A>
        </div>
        <div class="flex w-24 justify-between sm:mx-auto">
          <button type="button"><svg class="save w-[18px] stroke-[#444] dark:stroke-white my-auto" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="4" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M51,55.4,32.18,39A1,1,0,0,0,31,39L13,55.34a1,1,0,0,1-1.6-.8V9.41a1,1,0,0,1,1-1H51.56a1,1,0,0,1,1,1V54.58A1,1,0,0,1,51,55.4Z" stroke-linecap="round"></path></g></svg></button>
        </div>
      </div>
    </nav>
    </>
  );
}

{/* <svg class="bar hidden w-9 fill-neutral-900 items-center dark:fill-white sm:block" onClick={() => setIsLinksVisible(!isLinksVisible())} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 36 36">
<rect y="12" width="25" height="1.7"></rect>
<rect y="22" width="25" height="1.7"></rect>
</svg> */}
export default Nav;