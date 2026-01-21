<script>
export default {
  name: "BooksTable",
  props: {
    items: { type: Array, default: () => [] },
  },
  emits: ["delete", "edit"],
  methods: {
    initials(name) {
      const n = (name || "").trim();
      if (!n) return "BK";
      const parts = n.split(/\s+/).filter(Boolean);
      const first = parts[0]?.[0] || "B";
      const second = parts.length > 1 ? parts[1]?.[0] : (parts[0]?.[1] || "K");
      return (first + second).toUpperCase();
    },
    shortText(txt, max = 170) {
      if (!txt) return "";
      const clean = String(txt).trim();
      if (clean.length <= max) return clean;
      return clean.slice(0, max).trimEnd() + "…";
    },
  },
};
</script>

<template>
  <div>
    <div v-if="items.length === 0" class="empty-state p-4">
      <div class="fw-semibold mb-1">Raamatuid pole</div>
      <div class="text-muted">Lisa esimene raamat ülal oleva vormi kaudu.</div>
    </div>

    <ul v-else class="list-group list-group-flush">
      <li v-for="item in items" :key="item.BookID" class="list-group-item px-3 px-md-4 py-3">
        <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
          <div class="d-flex gap-3">
            <!-- Cover -->
            <div class="cover-wrap">
              <img
                v-if="item.ImageUrl"
                :src="item.ImageUrl"
                class="cover-img"
                alt="cover"
              />
              <div v-else class="cover-placeholder" aria-hidden="true">
                <div class="cover-initials">{{ initials(item.Name) }}</div>
              </div>
            </div>

            <!-- Text -->
            <div class="min-w-0">
              <div class="fw-semibold">{{ item.Name }}</div>

              <div class="text-muted small">
                <span v-if="item.Pages" class="me-2">{{ item.Pages }} lk</span>
                <span v-if="item.Language" class="me-2">{{ item.Language }}</span>
                <span v-if="item.ReleaseYear" class="me-2">{{ item.ReleaseYear }}</span>
                <span class="text-muted">ID: <span class="font-monospace">{{ item.BookID }}</span></span>
              </div>

              <div v-if="item.Description" class="mt-1 text-muted small">
                {{ shortText(item.Description) }}
              </div>
              <div v-else class="mt-1 text-muted small">Kirjeldus puudub.</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="btn-group">
            <router-link
              class="btn btn-sm btn-outline-secondary"
              :to="`/books/${item.BookID}`"
            >
              Uuri lähemalt
            </router-link>

            <button class="btn btn-sm btn-outline-primary" @click="$emit('edit', item)">
              Muuda
            </button>

            <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', item)">
              Kustuta
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.empty-state {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
}

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

.min-w-0 {
  min-width: 0;
}
</style>
