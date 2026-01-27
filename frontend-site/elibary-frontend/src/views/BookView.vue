<script>
import { getMyBooks, addMyBook, removeMyBook } from "@/services/userBooksApi";

export default {
  name: "BookView",

  data() {
    return {
      loading: false,
      error: "",
      success: "",
      book: null,

      myEntry: null,
      coverUrl: "",
    };
  },

  computed: {
    bookId() {
      return this.$route.params.id;
    },

    initials() {
      const name = this.book?.Name?.trim() || "";
      if (!name) return "BK";

      const parts = name.split(/\s+/).filter(Boolean);
      const first = parts[0]?.[0] || "B";
      const second = parts.length > 1 ? parts[1]?.[0] : (parts[0]?.[1] || "K");
      return (first + second).toUpperCase();
    },

    isInMyBooks() {
      return !!this.myEntry;
    },
  },

  async created() {
    await this.loadAll();
  },

  watch: {
    "$route.params.id": {
      async handler() {
        await this.loadAll();
      },
    },
  },

  methods: {
    async loadAll() {
      this.success = "";
      await Promise.all([this.loadBook(), this.loadMyEntrySafely()]);
      this.coverUrl = this.myEntry?.ImageUrl || this.book?.ImageUrl || "";
    },

    async loadBook() {
      this.loading = true;
      this.error = "";
      this.book = null;

      try {
        const res = await fetch(`http://localhost:8080/books/${this.bookId}`);
        if (!res.ok) throw new Error(`Book load failed (${res.status})`);
        this.book = await res.json();
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    async loadMyEntrySafely() {
      this.myEntry = null;

      try {
        const mine = await getMyBooks();
        this.myEntry = (mine || []).find((x) => x.BookID === this.bookId) || null;
      } catch {
        this.myEntry = null;
      }
    },

    async addToMyBooks() {
      this.error = "";
      this.success = "";

      if (this.isInMyBooks) {
        this.success = "See raamat on juba sinu nimekirjas.";
        return;
      }

      this.loading = true;
      try {
        await addMyBook({
          BookID: this.bookId,
          UserScore: null,
          ImageUrl: null,
        });

        this.success = "Raamat lisati sinu nimekirja.";
        await this.loadMyEntrySafely();
        this.coverUrl = this.myEntry?.ImageUrl || this.book?.ImageUrl || "";
      } catch (e) {
        const msg = e?.response?.status === 401 || e?.response?.status === 403
          ? "Palun logi sisse, et lisada raamat enda nimekirja."
          : (e?.message || String(e));

        this.error = msg;
      } finally {
        this.loading = false;
      }
    },

    async removeFromMyBooks() {
      this.error = "";
      this.success = "";

      if (!this.isInMyBooks) return;

      const ok = confirm(`Eemaldan sinu raamatute hulgast: "${this.book?.Name || this.bookId}"?`);
      if (!ok) return;

      this.loading = true;
      try {
        await removeMyBook(this.bookId);
        this.success = "Raamat eemaldati sinu nimekirjast.";
        this.myEntry = null;
        this.coverUrl = this.book?.ImageUrl || "";
      } catch (e) {
        const msg = e?.response?.status === 401 || e?.response?.status === 403
          ? "Palun logi sisse, et muuta oma raamatute nimekirja."
          : (e?.message || String(e));

        this.error = msg;
      } finally {
        this.loading = false;
      }
    },

    goBack() {
      if (window.history.length > 1) this.$router.back();
      else this.$router.push("/books");
    },

    async refresh() {
      await this.loadAll();
    },
  },
};
</script>

<template>
  <div class="book-page">
    <div class="container py-4 py-lg-5">
      <header class="page-header mb-4">
        <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
          <div>
            <h1 class="page-title mb-1">Raamatu info</h1>
            <p class="page-subtitle mb-0">Detailvaade valitud raamatust.</p>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" @click="goBack">
              Tagasi
            </button>

            <button
              v-if="!isInMyBooks"
              class="btn btn-primary"
              @click="addToMyBooks"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              Lisa minu raamatutesse
            </button>

            <button
              v-else
              class="btn btn-outline-success"
              type="button"
              disabled
              title="See raamat on juba sinu nimekirjas"
            >
              Juba minu raamatutes
            </button>

            <button
              v-if="isInMyBooks"
              class="btn btn-outline-danger"
              @click="removeFromMyBooks"
              :disabled="loading"
            >
              Eemalda
            </button>

            <button class="btn btn-outline-secondary" @click="refresh" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              Värskenda
            </button>
          </div>
        </div>
      </header>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="success" class="alert alert-success">
        {{ success }}
      </div>

      <div v-if="loading && !book" class="text-muted d-flex align-items-center gap-2">
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        Laen raamatu infot...
      </div>

      <div v-else-if="book" class="row g-4">
        <div class="col-12 col-lg-4">
          <div class="card card-elevated h-100">
            <div class="card-body p-3 p-md-4">
              <div class="cover-wrap">
                <img v-if="coverUrl" :src="coverUrl" class="cover-img" alt="Raamatu kaas" />

                <div v-else class="cover-placeholder">
                  <div class="cover-initials">{{ initials }}</div>
                  <div class="small text-muted mt-1">Pilt puudub</div>
                </div>
              </div>

              <div class="mt-3">
                <div class="text-muted small">BookID</div>
                <div class="font-monospace small">{{ book.BookID }}</div>
              </div>

              <div v-if="myEntry && (myEntry.UserScore !== null && myEntry.UserScore !== undefined)" class="mt-3">
                <div class="text-muted small">Sinu hinne</div>
                <div class="fw-semibold">{{ myEntry.UserScore }}</div>
              </div>

              <div class="mt-3 d-grid gap-2 d-lg-none">
                <button
                  v-if="!isInMyBooks"
                  class="btn btn-primary"
                  @click="addToMyBooks"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Lisa minu raamatutesse
                </button>

                <button v-else class="btn btn-outline-success" disabled>
                  Juba minu raamatutes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-8">
          <div class="card card-elevated">
            <div class="card-body p-3 p-md-4">
              <h2 class="h3 mb-2">{{ book.Name }}</h2>

              <div class="text-muted small mb-3">
                <span v-if="book.Language" class="me-2">{{ book.Language }}</span>
                <span v-if="book.ReleaseYear" class="me-2">{{ book.ReleaseYear }}</span>
                <span v-if="book.Pages">{{ book.Pages }} lk</span>
              </div>

              <div class="section-title">Kirjeldus</div>
              <div v-if="book.Description" class="description text-muted">
                {{ book.Description }}
              </div>
              <div v-else class="text-muted">Kirjeldus puudub.</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-muted">
        Raamatut ei leitud.
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-page {
  background: linear-gradient(180deg, rgba(13, 110, 253, 0.06), transparent 240px);
  min-height: 100%;
}

.page-title {
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: #6c757d;
  max-width: 70ch;
}

.card-elevated {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.cover-wrap {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.7);
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
  text-align: center;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.18), rgba(25, 135, 84, 0.12));
}

.cover-initials {
  width: 110px;
  height: 110px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 42px;
  letter-spacing: 0.06em;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.section-title {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
}

.description {
  white-space: pre-wrap;
}
</style>
