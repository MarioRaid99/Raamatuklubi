<script>
import BooksTable from "../components/BooksTable.vue";
import { getBooks, createBook, deleteBook /*, updateBook*/ } from "../services/booksApi";

export default {
  components: { BooksTable },

  data() {
    return {
      allBooks: [],
      loading: false,
      error: "",

      // create form
      form: {
        Name: "",
        Description: "",
        Pages: 1,
        ReleaseYear: new Date().getFullYear(),
        Language: "ET",
        UserScore: null,
      },

      // future: edit
      editing: null,
    };
  },

  async created() {
    await this.refresh();
  },

  methods: {
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

    async onCreate() {
      this.error = "";
      try {
        // lihtne kontroll
        if (!this.form.Name || !this.form.Description || !this.form.Language) {
          this.error = "Täida vähemalt Name, Description ja Language.";
          return;
        }

        await createBook({
          Name: this.form.Name,
          Description: this.form.Description,
          Pages: Number(this.form.Pages),
          ReleaseYear: Number(this.form.ReleaseYear),
          Language: this.form.Language,
          UserScore: this.form.UserScore,
        });

        // reset
        this.form.Name = "";
        this.form.Description = "";
        this.form.Pages = 1;
        this.form.ReleaseYear = new Date().getFullYear();
        this.form.Language = "ET";
        this.form.UserScore = null;

        await this.refresh();
      } catch (e) {
        this.error = e?.message || String(e);
      }
    },

    async onDelete(item) {
      const ok = confirm(`Kustutan raamatu: "${item.Name}"?`);
      if (!ok) return;

      this.error = "";
      try {
        await deleteBook(item.BookID);
        // kiire UX: eemalda kohe tabelist
        this.allBooks = this.allBooks.filter((b) => b.BookID !== item.BookID);
      } catch (e) {
        this.error = e?.message || String(e);
      }
    },

    onEdit(item) {
      // Praegu lihtsalt prefill vormi; päris update lisame siis kui backendil PATCH/PUT olemas
      this.editing = item;
      this.form = {
        Name: item.Name,
        Description: item.Description,
        Pages: item.Pages,
        ReleaseYear: item.ReleaseYear,
        Language: item.Language,
        UserScore: item.UserScore,
      };
      alert("Edit on UI-s ette valmistatud. Update hakkab tööle, kui lisad backendile PATCH/PUT /books/:BookID.");
    },
  },
};
</script>

<template>
  <main class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="m-0">Books</h2>
      <button class="btn btn-outline-secondary" @click="refresh" :disabled="loading">
        Refresh
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Lisa uus raamat</h5>

        <div class="row g-2">
          <div class="col-md-4">
            <input class="form-control" v-model="form.Name" placeholder="Name" />
          </div>
          <div class="col-md-2">
            <input class="form-control" type="number" v-model="form.Pages" placeholder="Pages" />
          </div>
          <div class="col-md-2">
            <input class="form-control" type="number" v-model="form.ReleaseYear" placeholder="ReleaseYear" />
          </div>
          <div class="col-md-2">
            <input class="form-control" v-model="form.Language" placeholder="Language" />
          </div>
          <div class="col-md-2 d-grid">
            <button class="btn btn-primary" @click="onCreate" :disabled="loading">
              Lisa
            </button>
          </div>
          <div class="col-12">
            <textarea class="form-control" v-model="form.Description" rows="2" placeholder="Description"></textarea>
          </div>
        </div>

        <div v-if="editing" class="text-muted mt-2">
          Edit mode: {{ editing.BookID }} (praegu ainult UI prefill)
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-muted">Laen raamatuid...</div>

    <BooksTable
      :items="allBooks"
      @delete="onDelete"
      @edit="onEdit"
    />
  </main>
</template>
