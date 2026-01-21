<script>
import BooksTable from "../components/BooksTable.vue";
import { getBooks, createBook, deleteBook, updateBook } from "../services/booksApi";

export default {
  name: "BooksView",
  components: { BooksTable },

  data() {
    return {
      allBooks: [],
      loading: false,
      error: "",

      form: {
        Name: "",
        Description: "",
        Pages: 1,
        ReleaseYear: new Date().getFullYear(),
        Language: "ET",
        UserScore: null,
      },

      editing: null,
    };
  },

  computed: {
    isEditing() {
      return !!this.editing;
    },
    submitText() {
      return this.isEditing ? "Salvesta muudatused" : "Lisa raamat";
    },
    canSubmit() {
      return Boolean(
        this.form.Name?.trim() &&
          this.form.Description?.trim() &&
          this.form.Language?.trim() &&
          Number(this.form.Pages) > 0 &&
          Number(this.form.ReleaseYear) > 0
      );
    },
  },

  async created() {
    await this.refresh();
  },

  methods: {
    /* ======================
       A) READ
    ====================== */
    async refresh() {
      this.error = "";
      this.loading = true;
      try {
        this.allBooks = await getBooks();
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    /* ======================
       B) CREATE / UPDATE
    ====================== */
    async submitForm() {
      this.error = "";

      if (!this.canSubmit) {
        this.error = "Täida vähemalt Name, Description ja Language (Pages/ReleaseYear peavad olema > 0).";
        return;
      }

      const payload = {
        Name: this.form.Name.trim(),
        Description: this.form.Description.trim(),
        Pages: Number(this.form.Pages),
        ReleaseYear: Number(this.form.ReleaseYear),
        Language: this.form.Language.trim(),
        UserScore: this.form.UserScore,
      };

      this.loading = true;
      try {
        if (this.editing) {
          await updateBook(this.editing.BookID, payload);
        } else {
          await createBook(payload);
        }

        await this.refresh();
        this.resetForm();
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    /* ======================
       C) DELETE
    ====================== */
    async onDelete(item) {
      const ok = confirm(`Kustutan raamatu: "${item.Name}"?`);
      if (!ok) return;

      this.error = "";
      this.loading = true;
      try {
        await deleteBook(item.BookID);
        this.allBooks = this.allBooks.filter((b) => b.BookID !== item.BookID);
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    /* ======================
       D) EDIT MODE
    ====================== */
    startEdit(item) {
      this.editing = item;
      this.form = {
        Name: item.Name,
        Description: item.Description,
        Pages: item.Pages,
        ReleaseYear: item.ReleaseYear,
        Language: item.Language,
        UserScore: item.UserScore,
      };

      // kerge UX: kerime vormi juurde
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    cancelEdit() {
      this.resetForm();
    },

    resetForm() {
      this.editing = null;
      this.form = {
        Name: "",
        Description: "",
        Pages: 1,
        ReleaseYear: new Date().getFullYear(),
        Language: "ET",
        UserScore: null,
      };
    },
  },
};
</script>

<template>
  <div class="books-page">
    <div class="container py-4 py-lg-5">
      <!-- Header -->
      <header class="page-header mb-4">
        <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
          <div>
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <h1 class="page-title mb-0">Raamatud</h1>
              <span v-if="isEditing" class="badge text-bg-warning">Muuda</span>
            </div>

            <p class="page-subtitle mb-0 mt-1">
              Halda raamatuid: lisa, muuda ja kustuta. Tabelist saad valida “Muuda”.
            </p>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary" @click="refresh" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Värskenda
            </button>

            <button v-if="isEditing" class="btn btn-outline-secondary" @click="cancelEdit" :disabled="loading">
              Tühista muutmine
            </button>
          </div>
        </div>
      </header>

      <!-- Error -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Form Card -->
      <div class="card card-elevated mb-4">
        <div class="card-body p-3 p-md-4">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h2 class="h6 mb-0">
              {{ isEditing ? "Muuda raamatut" : "Lisa uus raamat" }}
            </h2>

            <small v-if="isEditing" class="text-muted">
              ID: <span class="font-monospace">{{ editing.BookID }}</span>
            </small>
          </div>

          <form @submit.prevent="submitForm">
            <div class="row g-3">
              <div class="col-12 col-lg-5">
                <label class="form-label">Nimi</label>
                <input class="form-control" v-model="form.Name" placeholder="Raamatu nimi" />
              </div>

              <div class="col-12 col-sm-6 col-lg-2">
                <label class="form-label">Leheküljed</label>
                <input class="form-control" type="number" v-model.number="form.Pages" min="1" placeholder="nt 250" />
              </div>

              <div class="col-12 col-sm-6 col-lg-2">
                <label class="form-label">Aasta</label>
                <input class="form-control" type="number" v-model.number="form.ReleaseYear" min="0" placeholder="nt 2015" />
              </div>

              <div class="col-12 col-sm-6 col-lg-3">
                <label class="form-label">Keel</label>
                <input class="form-control" v-model="form.Language" placeholder="ET / EN" />
              </div>

              <div class="col-12">
                <label class="form-label">Kirjeldus</label>
                <textarea
                  class="form-control"
                  v-model="form.Description"
                  rows="3"
                  placeholder="Lühikirjeldus, märksõnad, kokkuvõte..."
                />
              </div>

              <div class="col-12 d-grid d-md-flex gap-2 mt-2">
                <button class="btn btn-primary px-4" type="submit" :disabled="loading || !canSubmit">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ submitText }}
                </button>

                <button v-if="isEditing" class="btn btn-outline-secondary" type="button" @click="cancelEdit" :disabled="loading">
                  Tühista
                </button>

                <button v-if="!isEditing && (form.Name || form.Description)" class="btn btn-outline-secondary" type="button" @click="resetForm" :disabled="loading">
                  Puhasta vorm
                </button>
              </div>

              <div class="col-12">
                <small class="text-muted">
                  Kohustuslik: Name, Description, Language. Pages ja ReleaseYear peavad olema positiivsed.
                </small>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Table / List -->
      <div class="card card-elevated">
        <div class="card-body p-0">
          <div class="px-3 px-md-4 pt-3 pt-md-4 pb-2 border-bottom d-flex align-items-center justify-content-between">
            <div>
              <h2 class="h6 mb-1">Raamatute nimekiri</h2>
              <div class="text-muted small">
                Kokku: <strong class="text-body">{{ allBooks.length }}</strong>
              </div>
            </div>

            <div v-if="loading" class="text-muted small d-flex align-items-center gap-2">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Laen...
            </div>
          </div>

          <div class="p-3 p-md-4" v-if="!loading && allBooks.length === 0">
            <div class="empty-state">
              <div class="fw-semibold mb-1">Raamatuid pole</div>
              <div class="text-muted">Lisa esimene raamat ülal oleva vormi kaudu.</div>
            </div>
          </div>

          <div v-else class="p-2 p-md-3">
            <!-- BooksTable jääb teie enda komponendiks -->
            <BooksTable :items="allBooks" @delete="onDelete" @edit="startEdit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.books-page {
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

.empty-state {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.7);
}
</style>
