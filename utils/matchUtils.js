
const input = [
    {
        "gpa": 2.5,
        "age": 35
    },
    {
        "gpa": 3.5,
        "age": 35
    }
]
const store = [
    {
        "gpa": 2.5,
        "age": 35
    },
    {
        "gpa": 3.5,
        "age": 35
    }
]   
function equal(input, store){
    return input.length == store.length && // same length and
        input.every( // every element in a
            e1 => store.some( // has a match in b
                e2 => Object.keys(e1).every(key => e1[key] === e2[key] || e1[key] > e2[key])
            )
        )
}
  const match = equal(input,store);
  console.log(match)