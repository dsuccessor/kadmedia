const removePwd = async (data) =>{
    const {password, ...rest} = data;
    return {...rest};
}

module.exports = {removePwd}