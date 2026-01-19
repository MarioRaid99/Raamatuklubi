<script>
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from "@/services/eventsApi";

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

    async onCreate() {
      this.error = "";

      if (!this.form.Title || !this.form.StartTime) {
        this.error = "Title ja StartTime on kohustuslikud.";
        return;
      }

      try {
        await createEvent({
          Title: this.form.Title,
          Description: this.form.Description,
          StartTime: this.form.StartTime,
          EndTime: this.form.EndTime || null,
          Location: this.form.Location,
        });

        this.form = {
          Title: "",
          Description: "",
          StartTime: "",
          EndTime: "",
          Location: "",
        };

        await this.refresh();
      } catch (e) {
        this.error = e?.message || String(e);
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
    },

    async onUpdate() {
      if (!this.editing) return;

      this.error = "";

      try {
        await updateEvent(this.editing.EventID, {
          Title: this.form.Title,
          Description: this.form.Description,
          StartTime: this.form.StartTime,
          EndTime: this.form.EndTime || null,
          Location: this.form.Location,
        });

        this.editing = null;

        this.form = {
          Title: "",
          Description: "",
          StartTime: "",
          EndTime: "",
          Location: "",
        };

        await this.refresh();
      } catch (e) {
        this.error = e?.message || String(e);
      }
    },

    cancelEdit() {
      this.editing = null;

      this.form = {
        Title: "",
        Description: "",
        StartTime: "",
        EndTime: "",
        Location: "",
      };
    },

    async onDelete(item) {
      const ok = confirm(`Kustutan eventi: "${item.Title}"?`);
      if (!ok) return;

      this.error = "";

      try {
        await deleteEvent(item.EventID);
        this.allEvents = this.allEvents.filter(
          (x) => x.EventID !== item.EventID
        );
      } catch (e) {
        this.error = e?.message || String(e);
      }
    },
  },
};
</script>

<template>
  <main class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="m-0">Events</h2>

      <button
        class="btn btn-outline-secondary"
        @click="refresh"
        :disabled="loading"
      >
        Refresh
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">
          {{ editing ? "Muuda event" : "Lisa uus event" }}
        </h5>

        <div class="row g-2">
          <div class="col-md-6">
            <input
              class="form-control"
              v-model="form.Title"
              placeholder="Title"
            />
          </div>

          <div class="col-md-6">
            <input
              class="form-control"
              v-model="form.Location"
              placeholder="Location"
            />
          </div>

          <div class="col-md-6">
            <input
              class="form-control"
              v-model="form.StartTime"
              placeholder="StartTime (YYYY-MM-DDTHH:mm:ssZ)"
            />
          </div>

          <div class="col-md-6">
            <input
              class="form-control"
              v-model="form.EndTime"
              placeholder="EndTime (optional)"
            />
          </div>

          <div class="col-12">
            <textarea
              class="form-control"
              v-model="form.Description"
              rows="2"
              placeholder="Description"
            />
          </div>

          <div class="col-12 d-grid">
            <button
              v-if="!editing"
              class="btn btn-primary"
              @click="onCreate"
              :disabled="loading"
            >
              Lisa
            </button>

            <div v-else class="d-grid gap-2">
              <button
                class="btn btn-success"
                @click="onUpdate"
                :disabled="loading"
              >
                Salvesta
              </button>

              <button class="btn btn-outline-danger" @click="cancelEdit">
                Cancel edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-muted">Laen evente...</div>

    <ul v-else class="list-group">
      <li
        v-for="e in allEvents"
        :key="e.EventID"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="text-start">
          <div class="fw-bold">{{ e.Title }}</div>
          <div class="text-muted small">
            {{ e.StartTime }} — {{ e.Location }}
          </div>
        </div>

        <div class="btn-group">
          <button class="btn btn-sm btn-outline-primary" @click="startEdit(e)">
            Edit
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="onDelete(e)">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </main>
</template>
