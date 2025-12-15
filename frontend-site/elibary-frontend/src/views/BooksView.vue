<script>
    import BooksTable from '../components/BooksTable.vue'
    export default {
        components:  {
            BooksTable 
        },
        data() { 
            return {
            allBooks: []
            }
        },
    async created() { 
        this.allBooks = await (await fetch('http://localhost:8080/books')).json()
    }}
</script>
<template>
    <main>
        <BooksTable :items="allBooks"/>
    </main>
</template>

