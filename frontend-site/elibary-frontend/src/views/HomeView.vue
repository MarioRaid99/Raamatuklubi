<template>
  <div class="home container py-4">
    <img alt="Vue logo" src="../assets/logo.png" style="max-width: 120px" />

    <HelloWorld msg="Welcome to Your Vue.js App" />

    <div class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">Otsi raamatuid</h5>

        <div class="row g-2">
          <div class="col-md-6">
            <input
              class="form-control"
              v-model="search"
              placeholder="Otsi (Name / Description)"
            />
          </div>

          <div class="col-md-3">
            <input
              class="form-control"
              v-model="language"
              placeholder="Language (ET/EN)"
            />
          </div>

          <div class="col-md-3">
            <input
              class="form-control"
              v-model="year"
              placeholder="Release year"
              type="number"
            />
          </div>

          <div class="col-12 d-grid">
            <button
              class="btn btn-primary"
              @click="refresh"
              :disabled="loading"
            >
              Otsi
            </button>
          </div>
        </div>

        <div v-if="error" class="alert alert-danger mt-3 mb-0">
          {{ error }}
        </div>
      </div>
    </div>

    <div class="mt-3" v-if="loading">Laen...</div>

    <div class="mt-3" v-else>
      <h5>Tulemused: {{ allBooks.length }}</h5>
      <ul class="list-group">
        <li class="list-group-item" v-for="b in allBooks" :key="b.BookID">
          <strong>{{ b.Name }}</strong>
          <span class="text-muted"> — {{ b.BookID }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";
import { getBooks } from "@/services/booksApi";

export default {
  name: "HomeView",
  components: { HelloWorld },

  data() {
    return {
      allBooks: [],
      loading: false,
      error: "",

      // filter state
      search: "",
      language: "",
      year: "",
    };
  },

  async created() {
    await this.refresh();
  },

  methods: {
    async refresh() {
      this.loading = true;
      this.error = "";
      try {
        this.allBooks = await getBooks({
          q: this.search,
          language: this.language,
          year: this.year || undefined,
        });
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
