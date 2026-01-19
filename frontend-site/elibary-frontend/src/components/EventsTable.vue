<script>
export default {
  name: "EventsTable",
  props: {
    items: Array,
  },
};
</script>

<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>EventID</th>
        <th>Title</th>
        <th>Start</th>
        <th>Location</th>
        <th>Tegevused</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="!items || items.length === 0">
        <td colspan="5" class="text-muted">Evente pole (veel).</td>
      </tr>

      <tr v-for="e in items" :key="e.EventID">
        <td>{{ e.EventID }}</td>
        <td>{{ e.Title }}</td>
        <td>{{ e.StartTime }}</td>
        <td>{{ e.Location }}</td>
        <td class="d-flex gap-2">
          <button
            class="btn btn-sm btn-outline-primary"
            @click="$emit('edit', e)"
          >
            Edit
          </button>
          <button
            class="btn btn-sm btn-outline-danger"
            @click="$emit('delete', e)"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
