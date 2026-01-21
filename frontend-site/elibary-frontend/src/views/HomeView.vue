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

          <div class="header-meta small text-muted" v-if="hasSearched">
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
                <input class="form-control" v-model.trim="language" placeholder="ET / EN" />
              </div>

              <div class="col-12 col-md-6 col-lg-3">
                <label class="form-label">Ilmumisaasta</label>
                <input class="form-control" v-model.number="year" placeholder="nt 2005" type="number" min="0" />
              </div>

              <div class="col-12 d-grid d-md-flex gap-2 mt-2">
                <button class="btn btn-primary px-4" type="submit" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Otsi
                </button>

                <button
                  v-if="hasFilters || hasSearched"
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="resetFilters"
                  :disabled="loading"
                >
                  Puhasta
                </button>
              </div>

              <div class="col-12">
                <small class="text-muted">Tulemusi ei kuvata enne, kui vajutad “Otsi”.</small>
              </div>
            </div>
          </form>

          <div v-if="error" class="alert alert-danger mt-3 mb-0">
            {{ error }}
          </div>
        </div>
      </div>

      <!-- Results -->
      <section class="results" v-if="hasSearched">
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
                <div class="text-muted">Proovi muuta otsingusõna või eemaldada mõned filtrid.</div>
              </div>
            </div>

            <ul v-else class="list-group list-group-flush">
              <li class="list-group-item px-3 px-md-4 py-3" v-for="b in allBooks" :key="b.BookID">
                <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                  <div class="d-flex gap-3">
                    <div class="cover-wrap">
                      <img
                        v-if="coverSrc(b)"
                        :src="coverSrc(b)"
                        class="cover-img"
                        alt="Kaas"
                        @error="onCoverError(b.BookID)"
                      />
                      <div v-else class="cover-placeholder" aria-hidden="true">
                        <div class="cover-initials">{{ initials(b.Name) }}</div>
                      </div>
                    </div>

                    <div class="min-w-0">
                      <div class="fw-semibold">{{ b.Name }}</div>

                      <div class="text-muted small">
                        <span v-if="b.Pages" class="me-2">{{ b.Pages }} lk</span>
                        <span v-if="b.Language" class="me-2">{{ b.Language }}</span>
                        <span v-if="b.ReleaseYear" class="me-2">{{ b.ReleaseYear }}</span>
                      </div>

                      <div v-if="b.Description" class="mt-1 text-muted small">
                        {{ shortText(b.Description, 190) }}
                      </div>
                      <div v-else class="mt-1 text-muted small">Kirjeldus puudub.</div>
                    </div>
                  </div>

                  <div class="btn-group">
                    <router-link class="btn btn-sm btn-outline-secondary" :to="`/books/${b.BookID}`">
                      Uuri lähemalt
                    </router-link>
                  </div>
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
import { getMyBooks } from "@/services/userBooksApi";

export default {
  name: "HomeView",

  data() {
    return {
      allBooks: [],
      loading: false,
      error: "",

      search: "",
      language: "",
      year: null,

      hasSearched: false,

      myImageByBookId: {},

      coverFailed: {},
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

  methods: {
    async refresh() {
      this.loading = true;
      this.error = "";
      this.hasSearched = true;

      this.coverFailed = {};

      try {
        this.allBooks = await getBooks({
          q: this.search,
          language: this.language,
          year: this.year || undefined,
        });

        await this.loadMyImagesSafely();
      } catch (e) {
        this.error = e?.message || String(e);
        this.allBooks = [];
      } finally {
        this.loading = false;
      }
    },

    async loadMyImagesSafely() {
      try {
        const mine = await getMyBooks();
        const map = {};
        for (const x of mine || []) {
          if (x?.BookID && x?.ImageUrl) map[x.BookID] = x.ImageUrl;
        }
        this.myImageByBookId = map;
      } catch {
        // ignore if not logged in or endpoint blocked
        this.myImageByBookId = {};
      }
    },

    resetFilters() {
      this.search = "";
      this.language = "";
      this.year = null;

      this.hasSearched = false;
      this.allBooks = [];
      this.error = "";

      this.myImageByBookId = {};
      this.coverFailed = {};
    },

    coverSrc(b) {
      // If image failed once, never try again this render cycle
      if (this.coverFailed[b.BookID]) return "";

      // Priority: MyBooks uploaded image -> book.ImageUrl (if your backend returns it) -> none
      return this.myImageByBookId[b.BookID] || b.ImageUrl || "";
    },

    onCoverError(bookId) {
      this.$set ? this.$set(this.coverFailed, bookId, true) : (this.coverFailed[bookId] = true);
    },

    initials(name) {
      const n = (name || "").trim();
      if (!n) return "BK";
      const parts = n.split(/\s+/).filter(Boolean);
      const first = parts[0]?.[0] || "B";
      const second = parts.length > 1 ? parts[1]?.[0] : (parts[0]?.[1] || "K");
      return (first + second).toUpperCase();
    },

    shortText(txt, max = 190) {
      if (!txt) return "";
      const clean = String(txt).trim();
      if (clean.length <= max) return clean;
      return clean.slice(0, max).trimEnd() + "…";
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

.min-w-0 {
  min-width: 0;
}

/* Cover */
.cover-wrap {
  width: 70px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.7);
  flex: 0 0 auto;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.18), rgba(25, 135, 84, 0.12));
}

.cover-initials {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.06em;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
