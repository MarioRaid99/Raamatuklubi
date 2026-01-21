<template>
  <div class="home-page">
    <div class="container py-4 py-lg-5">
      <!-- Header -->
      <header class="page-header mb-4">
        <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
          <div>
            <h1 class="page-title mb-1">Raamatukogu</h1>
            <p class="page-subtitle mb-0">
              Otsi raamatuid nime, kirjelduse, keele või ilmumisaasta järgi.
            </p>
          </div>

          <div class="header-meta small text-muted">
            Tulemusi: <strong class="text-body">{{ allBooks.length }}</strong>
          </div>
        </div>
      </header>

      <!-- Search / Filters -->
      <div class="card card-elevated mb-4">
        <div class="card-body p-3 p-md-4">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h2 class="h6 mb-0">Otsingu filtrid</h2>

            <button
              v-if="hasFilters && !loading"
              class="btn btn-sm btn-outline-secondary"
              type="button"
              @click="resetFilters"
            >
              Puhasta
            </button>
          </div>

          <form @submit.prevent="refresh">
            <div class="row g-3 align-items-end">
              <div class="col-12 col-lg-6">
                <label class="form-label">Nimi või kirjeldus</label>
                <input
                  class="form-control"
                  v-model.trim="search"
                  placeholder="Näiteks: Harry Potter, ulme, kokandus..."
                />
              </div>

              <div class="col-12 col-md-6 col-lg-3">
                <label class="form-label">Keel</label>
                <input
                  class="form-control"
                  v-model.trim="language"
                  placeholder="ET / EN"
                />
              </div>

              <div class="col-12 col-md-6 col-lg-3">
                <label class="form-label">Ilmumisaasta</label>
                <input
                  class="form-control"
                  v-model.number="year"
                  placeholder="nt 2005"
                  type="number"
                  min="0"
                />
              </div>

              <div class="col-12 d-grid d-md-flex gap-2 mt-2">
                <button class="btn btn-primary px-4" type="submit" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Otsi
                </button>

                <button
                  v-if="hasFilters"
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="resetFilters"
                  :disabled="loading"
                >
                  Puhasta
                </button>
              </div>
            </div>
          </form>

          <div v-if="error" class="alert alert-danger mt-3 mb-0">
            {{ error }}
          </div>
        </div>
      </div>

      <!-- Results -->
      <section class="results">
        <div v-if="loading" class="card card-elevated">
          <div class="card-body p-4">
            <div class="d-flex align-items-center gap-3">
              <div class="spinner-border" role="status" aria-hidden="true"></div>
              <div>
                <div class="fw-semibold">Laen tulemusi…</div>
                <div class="text-muted small">Palun oota hetk.</div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="card card-elevated">
          <div class="card-body p-0">
            <div class="px-3 px-md-4 pt-3 pt-md-4 pb-2 border-bottom">
              <h2 class="h6 mb-1">Tulemused</h2>
              <div class="text-muted small">
                Kokku: <strong class="text-body">{{ allBooks.length }}</strong>
              </div>
            </div>

            <div v-if="allBooks.length === 0" class="p-4">
              <div class="empty-state">
                <div class="fw-semibold mb-1">Tulemusi ei leitud</div>
                <div class="text-muted">
                  Proovi muuta otsingusõna või eemaldada mõned filtrid.
                </div>
              </div>
            </div>

            <ul v-else class="list-group list-group-flush">
              <li class="list-group-item px-3 px-md-4 py-3" v-for="b in allBooks" :key="b.BookID">
                <div class="d-flex align-items-start justify-content-between gap-3">
                  <div class="min-w-0">
                    <div class="fw-semibold text-truncate">{{ b.Name }}</div>
                    <div class="text-muted small text-truncate">
                      ID: {{ b.BookID }}
                    </div>
                  </div>

                  <!-- Jätsin siia koha tulevase "Detail" nupu jaoks,
                       kui teil on olemas /books/:id route -->
                  <!--
                  <router-link class="btn btn-sm btn-outline-primary" :to="`/books/${b.BookID}`">
                    Vaata
                  </router-link>
                  -->
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getBooks } from "@/services/booksApi";

export default {
  name: "HomeView",

  data() {
    return {
      allBooks: [],
      loading: false,
      error: "",

      // filter state
      search: "",
      language: "",
      year: null,
    };
  },

  computed: {
    hasFilters() {
      return Boolean(
        (this.search && this.search.length > 0) ||
        (this.language && this.language.length > 0) ||
        (this.year !== null && this.year !== "" && this.year !== undefined)
      );
    },
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

    async resetFilters() {
      this.search = "";
      this.language = "";
      this.year = null;
      await this.refresh();
    },
  },
};
</script>

<style scoped>
.home-page {
  background: linear-gradient(180deg, rgba(13, 110, 253, 0.06), transparent 240px);
  min-height: 100%;
}

.page-title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: #6c757d;
  max-width: 60ch;
}

.card-elevated {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.empty-state {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.7);
}
</style>
