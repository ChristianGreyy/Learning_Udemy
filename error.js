const sum = (a,b) => {
    return a+b;
}

try {
    if(sum(1,2) === 3) {
        throw new Error('error!!!')
    }
} catch(err) {
    throw new Error(err);
    // console.log(err)
}