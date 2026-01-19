<script>
import EventsTable from "../components/EventsTable.vue";
import { getEvents, createEvent, deleteEvent } from "../services/eventsApi";

export default {
  components: { EventsTable },

  data() {
    return {
      allEvents: [],
      loading: false,
      error: "",

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
      try {
        if (!this.form.Title || !this.form.StartTime) {
          this.error = "Täida vähemalt Title ja StartTime.";
          return;
        }

        await createEvent({
          Title: this.form.Title,
          Description: this.form.Description || null,
          StartTime: this.form.StartTime,
          EndTime: this.form.EndTime || null,
          Location: this.form.Location || null,
        });

        this.form = { Title: "", Description: "", StartTime: "", EndTime: "", Location: "" };
        await this.refresh();
      } catch (e) {
        this.error = e?.message || String(e);
      }
    },

    async onDelete(item) {
      const ok = confirm(`Kustutan event'i: "${item.Title}"?`);
      if (!ok) return;

      this.error = "";
      try {
        await deleteEvent(item.EventID);
        this.allEvents = this.allEvents.filter((x) => x.EventID !== item.EventID);
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
      <button class="btn btn-outline-secondary" @click="refresh" :disabled="loading">
        Refresh
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Lisa uus event</h5>

        <div class="row g-2">
          <div class="col-md-4">
            <input class="form-control" v-model="form.Title" placeholder="Title" />
          </div>
          <div class="col-md-4">
            <input class="form-control" v-model="form.Location" placeholder="Location" />
          </div>
          <div class="col-md-4 d-grid">
            <button class="btn btn-primary" @click="onCreate" :disabled="loading">
              Lisa
            </button>
          </div>

          <div class="col-md-6">
            <input class="form-control" v-model="form.StartTime" placeholder="StartTime (YYYY-MM-DDTHH:mm)" />
          </div>
          <div class="col-md-6">
            <input class="form-control" v-model="form.EndTime" placeholder="EndTime (optional)" />
          </div>

          <div class="col-12">
            <textarea class="form-control" v-model="form.Description" rows="2" placeholder="Description"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-muted">Laen evente...</div>

    <EventsTable :items="allEvents" @delete="onDelete" />
  </main>
</template>
