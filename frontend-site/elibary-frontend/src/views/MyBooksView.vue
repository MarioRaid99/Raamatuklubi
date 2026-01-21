<script>
import { getBooks } from "../services/booksApi";
import { getMyBooks, addMyBook, updateMyBook, removeMyBook } from "../services/userBooksApi";
import { uploadImage } from "../services/uploadApi";

export default {
  name: "MyBooksView",

  data() {
    return {
      catalog: [],
      myBooks: [],

      loading: false,
      error: "",

      form: {
        BookID: "",
        UserScore: null,
        ImageUrl: "",
      },

      editing: null, // hoiab userBook rida
    };
  },

  computed: {
    isEditing() {
      return !!this.editing;
    },
    submitText() {
      return this.isEditing ? "Salvesta muudatused" : "Lisa minu raamatutesse";
    },
    canSubmit() {
      return Boolean(this.form.BookID);
    },

    // 1) Lookup map: BookID -> Book detail (Name, Description, Pages, jne)
    catalogById() {
      const map = {};
      for (const b of this.catalog) {
        map[b.BookID] = b;
      }
      return map;
    },

    // 2) Rikastatud list UI jaoks: lisa iga myBook kirje juurde book detail
    myBooksUi() {
      return (this.myBooks || []).map((ub) => ({
        ...ub,
        Book: this.catalogById[ub.BookID] || null,
      }));
    },
  },

  async created() {
    await this.refresh();
  },

  methods: {
    async refresh() {
      this.error = "";
      this.loading = true;

      try {
        const [allBooks, mine] = await Promise.all([getBooks(), getMyBooks()]);
        this.catalog = allBooks;
        this.myBooks = mine;
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    async onPickImage(e) {
      const file = e.target.files?.[0];
      if (!file) return;

      this.error = "";
      this.loading = true;

      try {
        const url = await uploadImage(file);
        this.form.ImageUrl = url;
      } catch (err) {
        this.error = err?.message || String(err);
      } finally {
        this.loading = false;
        e.target.value = "";
      }
    },

    async submitForm() {
      this.error = "";

      if (!this.canSubmit) {
        this.error = "Vali raamat (BookID on kohustuslik).";
        return;
      }

      const payload = {
        BookID: this.form.BookID,
        UserScore: this.form.UserScore === "" ? null : this.form.UserScore,
        ImageUrl: this.form.ImageUrl || null,
      };

      this.loading = true;

      try {
        if (this.editing) {
          await updateMyBook(this.editing.BookID, {
            UserScore: payload.UserScore,
            ImageUrl: payload.ImageUrl,
          });
        } else {
          await addMyBook(payload);
        }

        await this.refresh();
        this.resetForm();
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    async onDelete(item) {
      // item on nüüd myBooksUi element, seega item.Book võib olla olemas
      const bookName = item.Book?.Name || item.BookID;
      const ok = confirm(`Eemaldan minu raamatutest: "${bookName}"?`);
      if (!ok) return;

      this.error = "";
      this.loading = true;

      try {
        await removeMyBook(item.BookID);
        this.myBooks = this.myBooks.filter((x) => x.BookID !== item.BookID);
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    startEdit(item) {
      this.editing = item;

      this.form = {
        BookID: item.BookID,
        UserScore: item.UserScore ?? null,
        ImageUrl: item.ImageUrl ?? "",
      };

      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    cancelEdit() {
      this.resetForm();
    },

    resetForm() {
      this.editing = null;
      this.form = {
        BookID: "",
        UserScore: null,
        ImageUrl: "",
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
              <h1 class="page-title mb-0">My Books</h1>
              <span v-if="isEditing" class="badge text-bg-warning">Muuda</span>
            </div>

            <p class="page-subtitle mb-0 mt-1">
              Lisa raamat enda nimekirja, pane hinne ja lisa pilt (upload).
            </p>
          </div>

          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary" @click="refresh" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
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
              {{ isEditing ? "Muuda oma raamatut" : "Lisa raamat minu nimekirja" }}
            </h2>

            <small v-if="isEditing" class="text-muted">
              BookID: <span class="font-monospace">{{ editing.BookID }}</span>
            </small>
          </div>

          <form @submit.prevent="submitForm">
            <div class="row g-3">
              <div class="col-12 col-lg-6">
                <label class="form-label">Raamat (kataloogist)</label>
                <select class="form-select" v-model="form.BookID" :disabled="loading || isEditing">
                  <option value="" disabled>Vali raamat...</option>
                  <option v-for="b in catalog" :key="b.BookID" :value="b.BookID">
                    {{ b.Name }} ({{ b.Language }}, {{ b.ReleaseYear }})
                  </option>
                </select>
                <div class="form-text" v-if="isEditing">
                  Muutmisel BookID ei muutu (muudad score/pilti).
                </div>
              </div>

              <div class="col-12 col-sm-6 col-lg-3">
                <label class="form-label">Sinu hinne</label>
                <input
                  class="form-control"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  v-model.number="form.UserScore"
                  placeholder="nt 4.5"
                />
              </div>

              <div class="col-12">
                <label class="form-label">ImageUrl</label>
                <input class="form-control" v-model="form.ImageUrl" placeholder="http://... või tekib uploadist" />
              </div>

              <div class="col-12" v-if="form.ImageUrl">
                <small class="text-muted d-block mb-2">Preview</small>
                <img
                  :src="form.ImageUrl"
                  alt="cover"
                  style="width: 140px; height: 180px; object-fit: cover; border-radius: 12px"
                />
              </div>

              <div class="col-12 d-grid d-md-flex gap-2 mt-2">
                <button class="btn btn-primary px-4" type="submit" :disabled="loading || !canSubmit">
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {{ submitText }}
                </button>

                <button v-if="isEditing" class="btn btn-outline-secondary" type="button" @click="cancelEdit" :disabled="loading">
                  Tühista
                </button>

                <button
                  v-if="!isEditing && (form.BookID || form.ImageUrl)"
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="resetForm"
                  :disabled="loading"
                >
                  Puhasta vorm
                </button>
              </div>

              <div class="col-12">
                <small class="text-muted">
                  Raamatu lisamiseks vali raamat. Upload töötab ainult siis, kui oled loginud.
                </small>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- List -->
      <div class="card card-elevated">
        <div class="card-body p-0">
          <div class="px-3 px-md-4 pt-3 pt-md-4 pb-2 border-bottom d-flex align-items-center justify-content-between">
            <div>
              <h2 class="h6 mb-1">Minu raamatud</h2>
              <div class="text-muted small">
                Kokku: <strong class="text-body">{{ myBooksUi.length }}</strong>
              </div>
            </div>

            <div v-if="loading" class="text-muted small d-flex align-items-center gap-2">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Laen...
            </div>
          </div>

          <div class="p-3 p-md-4" v-if="!loading && myBooksUi.length === 0">
            <div class="empty-state">
              <div class="fw-semibold mb-1">Sul pole veel raamatuid</div>
              <div class="text-muted">Lisa esimene raamat ülal oleva vormi kaudu.</div>
            </div>
          </div>

          <ul v-else class="list-group list-group-flush">
            <li v-for="item in myBooksUi" :key="item.BookID" class="list-group-item px-3 px-md-4 py-3">
              <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                <div class="d-flex gap-3">
                  <img
                    v-if="item.ImageUrl"
                    :src="item.ImageUrl"
                    alt="cover"
                    style="width: 70px; height: 90px; object-fit: cover; border-radius: 10px"
                  />

                  <div class="min-w-0">
                    <div class="fw-semibold">
                      {{ item.Book?.Name || "Tundmatu raamat" }}
                    </div>

                    <div class="text-muted small">
                      <span v-if="item.Book?.Pages" class="me-2">{{ item.Book.Pages }} lk</span>
                      <span v-if="item.Book?.Language" class="me-2">{{ item.Book.Language }}</span>
                      <span v-if="item.Book?.ReleaseYear" class="me-2">{{ item.Book.ReleaseYear }}</span>

                      <span v-if="item.UserScore !== null && item.UserScore !== undefined">
                        Sinu hinne: <strong class="text-body">{{ item.UserScore }}</strong>
                      </span>
                    </div>

                    <div v-if="item.Book?.Description" class="mt-1 text-muted small">
                      {{ item.Book.Description }}
                    </div>
                  </div>
                </div>

                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="startEdit(item)" :disabled="loading">
                    Muuda
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="onDelete(item)" :disabled="loading">
                    Eemalda
                  </button>
                </div>
              </div>
            </li>
          </ul>

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

.min-w-0 {
  min-width: 0;
}
</style>
