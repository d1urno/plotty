<script setup lang="ts">
import Romance from '@/assets/romance.webp'
</script>

<template>
  <main
    class="relative overflow-y-auto bg-gradient-to-r from-teal-400 via-blue-500 to-blue-400 pb-20 text-white"
  >
    <section class="relative mb-10 pb-32 pt-20">
      <img class="absolute inset-0 h-full w-full object-cover opacity-65" :src="Romance" alt="" />
      <div class="container relative z-10 px-4 sm:px-6 lg:px-20">
        <section class="relative mb-12">
          <h1 class="mb-10 text-center text-4xl font-bold sm:text-5xl lg:text-6xl">
            Write beautiful stories
          </h1>
          <p class="text-lg sm:text-xl">
            <strong>Plotty</strong> is a simple, easy to use, AI text creation tool. It is designed
            to help you create beautiful <strong>texts</strong> based on character selections and
            customizations in a matter of minutes. It is perfect to create stunning content to share
            with your friends and family.
          </p>
        </section>
      </div>
    </section>
    <div class="container relative z-10 -mt-40 px-4 sm:px-6 lg:px-20">
      <section class="mx-auto mb-12 max-w-2xl rounded-lg bg-white p-6 text-black shadow-lg">
        <h2 class="mb-4 text-3xl font-bold sm:text-4xl">Features</h2>
        <ul class="list-inside list-disc space-y-2 text-lg sm:text-xl">
          <li>Simple and fun to use</li>
          <li>Powerful and flexible</li>
          <li>Export to PDF</li>
          <li>Share your stories with others</li>
        </ul>
      </section>
      <section class="mb-12">
        <h2 class="mb-4 text-3xl font-bold sm:text-4xl">How it works</h2>
        <p class="text-lg sm:text-xl">
          You can start by creating a new story and selecting the characters you want to include as
          main or secondary roles. Then you can select between text modes like script, story or
          article. Once you are done, click on "generate story" and you will be able to read and
          download a PDF with your story.
        </p>
      </section>
      <section class="mx-auto mb-12 max-w-2xl rounded-lg bg-white p-6 text-black shadow-lg">
        <h2 class="mb-4 text-3xl font-bold sm:text-4xl">Get started</h2>
        <p class="mb-4 text-lg sm:text-xl">
          Ready to get started? Create an story and share it with your friends and family.
        </p>
        <router-link
          to="/new"
          class="rounded bg-blue-500 px-4 py-2 text-center font-bold text-white hover:bg-blue-700"
        >
          Create story
        </router-link>
      </section>
    </div>
    <footer class="text-center">
      <p>© 2024 Plotty</p>
    </footer>
  </main>
</template>

<route lang="json">
{ "path": "/", "meta": { "weight": 1 } }
</route>
