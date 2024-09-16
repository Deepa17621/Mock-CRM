
export default class dao {
    constructor(url) {
        this.url=url;
    }

    // get  Method
    async get() {
        try {
            let res = await fetch(this.url);
            let responseObj= await res.json();
            if (!res.ok) {
                throw new Error("Error" + res.statusMessage + res.statusCode);
            }
            return responseObj;
        } catch (error) {
            console.log(error);
        }
    }
 
    // GetById
    async getById(id) {
        try {
            let res = await fetch(this.url+id);
            let responseObj= await res.json();
            if (!res.ok) {
                throw new Error("Error" + res.statusMessage + res.statusCode);
            }
            return responseObj;
        } catch (error) {
            console.log(error);
        }
    }
    // POST Method  - Save Obj to JSON
    
    async  post(obj) {
        try {
            let res = await fetch(this.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(obj)
            });
            if (!res.ok) {
                throw new Error("Error:" + res.status);
            }
            let postedObj= await res.json();
            return postedObj;
        } catch (error) {
            console.log(error);
        }
    }
    
    // PUT Method - Update Object
    
    async  put(id,objToBeUpdate) {
        try {
            let res = await fetch(this.url+id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(objToBeUpdate)
            });
            if (!res.ok) {
                throw new Error("Error: " + res.status);
            }
            let updatedObj= await res.json();
            return updatedObj;
        } catch (error) {
            console.log(error);
        }
    }

    // Delete Method - Delete Obj
    async delete(){
        try {
            let res = await fetch(this.url, {
                method: "DELETE"
            });
            if (!res.ok) {
                throw new Error("Error: " + res.status);
            }
            let updatedObj= await res.json();
            return updatedObj;
        } catch (error) {
            console.log(error);
        }
    }
}