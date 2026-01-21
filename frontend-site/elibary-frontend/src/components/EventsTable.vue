<script>
export default {
  name: "EventsTable",
  props: {
    items: { type: Array, default: () => [] },
  },
  emits: ["delete", "edit"],
};
</script>

<template>
  <div>
    <div v-if="items.length === 0" class="empty-state p-4">
      <div class="fw-semibold mb-1">Evente pole</div>
      <div class="text-muted">Lisa esimene event ülal oleva vormi kaudu.</div>
    </div>

    <div v-else class="table-responsive">
      <table class="table align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th class="text-nowrap">EventID</th>
            <th>Title</th>
            <th class="text-nowrap">Start</th>
            <th>Location</th>
            <th class="text-end" style="width: 200px">Tegevused</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="e in items" :key="e.EventID">
            <td class="text-muted font-monospace small text-nowrap">
              {{ e.EventID }}
            </td>
            <td class="fw-semibold">{{ e.Title }}</td>
            <td class="text-nowrap">{{ e.StartTime }}</td>
            <td>{{ e.Location }}</td>
            <td class="text-end">
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" @click="$emit('edit', e)">
                  Muuda
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', e)">
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
