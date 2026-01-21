<script>
export default {
  name: "BooksTable",
  props: {
    items: { type: Array, default: () => [] },
  },
  emits: ["delete", "edit"],
};
</script>

<template>
  <div>
    <div v-if="items.length === 0" class="empty-state p-4">
      <div class="fw-semibold mb-1">Raamatuid pole</div>
      <div class="text-muted">Lisa esimene raamat ülal oleva vormi kaudu.</div>
    </div>

    <div v-else class="table-responsive">
      <table class="table align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th class="text-nowrap">BookID</th>
            <th>Nimi</th>
            <th class="text-nowrap">Lehekülgi</th>
            <th class="text-nowrap">Aasta</th>
            <th class="text-nowrap">Keel</th>
            <th class="text-end" style="width: 220px">Tegevused</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in items" :key="item.BookID">
            <td class="text-muted font-monospace small text-nowrap">
              {{ item.BookID }}
            </td>
            <td class="fw-semibold">{{ item.Name }}</td>
            <td class="text-nowrap">{{ item.Pages }}</td>
            <td class="text-nowrap">{{ item.ReleaseYear }}</td>
            <td class="text-nowrap">{{ item.Language }}</td>

            <td class="text-end">
              <div class="btn-group">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="$emit('edit', item)"
                >
                  Muuda
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="$emit('delete', item)"
                >
                  Kustuta
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
}
</style>
