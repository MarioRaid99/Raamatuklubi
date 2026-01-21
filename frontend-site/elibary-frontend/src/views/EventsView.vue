<script>
import { getEvents, createEvent, deleteEvent, updateEvent } from "@/services/eventsApi";

export default {
  name: "EventsView",

  data() {
    return {
      allEvents: [],
      loading: false,
      error: "",

      editing: null,

      form: {
        Title: "",
        Description: "",
        StartTime: "",
        EndTime: "",
        Location: "",
      },
    };
  },

  computed: {
    isEditing() {
      return !!this.editing;
    },
    canSubmit() {
      return Boolean(this.form.Title?.trim() && this.form.StartTime?.trim());
    },
    submitText() {
      return this.isEditing ? "Salvesta muudatused" : "Lisa event";
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
        this.allEvents = await getEvents();
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.form = {
        Title: "",
        Description: "",
        StartTime: "",
        EndTime: "",
        Location: "",
      };
    },

    async submit() {
      this.error = "";

      if (!this.canSubmit) {
        this.error = "Title ja StartTime on kohustuslikud.";
        return;
      }

      this.loading = true;
      try {
        const payload = {
          Title: this.form.Title,
          Description: this.form.Description,
          StartTime: this.form.StartTime,
          EndTime: this.form.EndTime || null,
          Location: this.form.Location,
        };

        if (!this.editing) {
          await createEvent(payload);
        } else {
          await updateEvent(this.editing.EventID, payload);
        }

        this.editing = null;
        this.resetForm();
        await this.refresh();
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },

    startEdit(item) {
      this.editing = item;

      this.form = {
        Title: item.Title || "",
        Description: item.Description || "",
        StartTime: item.StartTime || "",
        EndTime: item.EndTime || "",
        Location: item.Location || "",
      };

      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    cancelEdit() {
      this.editing = null;
      this.resetForm();
    },

    async onDelete(item) {
      const ok = confirm(`Kustutan eventi: "${item.Title}"?`);
      if (!ok) return;

      this.error = "";
      this.loading = true;

      try {
        await deleteEvent(item.EventID);
        this.allEvents = this.allEvents.filter((x) => x.EventID !== item.EventID);
      } catch (e) {
        this.error = e?.message || String(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<template>
  <div class="events-page">
    <div class="container py-4 py-lg-5">
      <!-- Header -->
      <header class="page-header mb-4">
        <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
          <div>
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <h1 class="page-title mb-0">Events</h1>
              <span v-if="isEditing" class="badge text-bg-warning">Muuda</span>
            </div>
            <p class="page-subtitle mb-0 mt-1">
              Lisa uusi üritusi või halda olemasolevaid (muuda/kustuta).
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

      <!-- Form -->
      <div class="card card-elevated mb-4">
        <div class="card-body p-3 p-md-4">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h2 class="h6 mb-0">
              {{ isEditing ? "Muuda eventi" : "Lisa uus event" }}
            </h2>

            <small v-if="isEditing" class="text-muted">
              ID: <span class="font-monospace">{{ editing.EventID }}</span>
            </small>
          </div>

          <form @submit.prevent="submit">
            <div class="row g-3">
              <div class="col-12 col-lg-6">
                <label class="form-label">Pealkiri</label>
                <input class="form-control" v-model="form.Title" placeholder="Eventi nimi" />
              </div>

              <div class="col-12 col-lg-6">
                <label class="form-label">Asukoht</label>
                <input class="form-control" v-model="form.Location" placeholder="Näiteks: Tallinn, Kultuurikatel..." />
              </div>

              <div class="col-12 col-lg-6">
                <label class="form-label">Algusaeg</label>
                <input
                  class="form-control"
                  v-model="form.StartTime"
                  placeholder="YYYY-MM-DDTHH:mm:ssZ"
                />
                <div class="form-text">
                  Näide: 2026-01-20T18:30:00Z
                </div>
              </div>

              <div class="col-12 col-lg-6">
                <label class="form-label">Lõppaeg (valikuline)</label>
                <input class="form-control" v-model="form.EndTime" placeholder="YYYY-MM-DDTHH:mm:ssZ" />
              </div>

              <div class="col-12">
                <label class="form-label">Kirjeldus</label>
                <textarea
                  class="form-control"
                  v-model="form.Description"
                  rows="3"
                  placeholder="Lühikirjeldus, ajakava, lisainfo..."
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

                <button
                  v-if="!isEditing && (form.Title || form.Location || form.StartTime || form.Description)"
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
                  Kohustuslik: Title ja StartTime.
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
              <h2 class="h6 mb-1">Eventide nimekiri</h2>
              <div class="text-muted small">
                Kokku: <strong class="text-body">{{ allEvents.length }}</strong>
              </div>
            </div>

            <div v-if="loading" class="text-muted small d-flex align-items-center gap-2">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Laen...
            </div>
          </div>

          <div v-if="!loading && allEvents.length === 0" class="p-4">
            <div class="empty-state">
              <div class="fw-semibold mb-1">Evente pole</div>
              <div class="text-muted">Lisa esimene event ülal oleva vormi kaudu.</div>
            </div>
          </div>

          <ul v-else class="list-group list-group-flush">
            <li
              v-for="e in allEvents"
              :key="e.EventID"
              class="list-group-item px-3 px-md-4 py-3"
            >
              <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                <div class="min-w-0">
                  <div class="fw-semibold">{{ e.Title }}</div>

                  <div class="text-muted small">
                    <span class="me-2">
                      <strong class="text-body">Algus:</strong> {{ e.StartTime }}
                    </span>
                    <span v-if="e.Location">
                      <strong class="text-body">Asukoht:</strong> {{ e.Location }}
                    </span>
                  </div>

                  <div v-if="e.Description" class="mt-1 text-muted small">
                    {{ e.Description }}
                  </div>
                </div>

                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="startEdit(e)" :disabled="loading">
                    Muuda
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="onDelete(e)" :disabled="loading">
                    Kustuta
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
.events-page {
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
