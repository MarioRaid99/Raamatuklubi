<script>
    export default{
        // components: {
        //        thisBook: {
        //         BookID:"",
        //         Name:"",
        //         Description:"desc",
        //         UserScore:1,
        //         RunTime:1,
        //         ReleaseYear:2000,
        //         Language:""
        //     }
        // },
        props: {
            seekID:{
                type:String,
                required:true
            },
        },
        data() { return { thisBook: 
            {
            BookID:"",
            Name:"",
            Description:"desc",
            UserScore:1,
            RunTime:1,
            ReleaseYear:2000,
            Language:""
            }
        }
        },       
        beforeMount() {
            this.getDetails()
        },
        methods: {
            async getDetails() {
            this.thisBook = await (await fetch(`http://localhost:8080/books/${this.seekID}`)).json();
        }
        }    
    }
</script>
<template>
    <table class="table table-striped">
        <tr>
            <td>Raamatu ID</td>
            <td>{{thisBook.BookID}}</td>
        </tr>
        <tr>
            <td>Nimi</td>
            <td>{{thisBook.Name}}</td>
        </tr>
        <tr>
            <td>Kirjeldus</td>
            <td>{{thisBook.Description}}</td>
        </tr>
        <tr>
            <td>Hinnang</td>
            <td>{{thisBook.UserScore}}</td>
        </tr>
        <tr>
            <td>Leheküljed</td>
            <td>{{thisBook.Pages}}</td>
        </tr>
        <tr>
            <td>Väljalasekeaasta</td>
            <td>{{thisBook.UserScore}}</td>
        </tr>
        <tr>
            <td>Raamatu keel</td>
            <td>{{thisBook.Language}}</td>
        </tr>
    </table>
</template>