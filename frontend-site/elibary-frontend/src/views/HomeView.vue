<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { getBooks } from "@/services/booksApi";
this.allBooks = await getBooks({
  q: this.search,
  language: this.language,
  year: this.year,
});


export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
};
</script>
