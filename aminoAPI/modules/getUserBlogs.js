const fetch = require('isomorphic-fetch'); //The Request Module for sending the different Modules
const endpoints = require('../helpers/endpoints.js'); //For Creating shorter URL's in this Module
const objs = require('../helpers/objects.js'); //For Storing the Objects that the Framework returns. 
const { getConfig } = require('../Amino');

/**
 * Loads all blogs from a specific user
 * @param {CommunityUUID} com A ID that can be obtained by the function getJoinedComs
 * @param {UserUUID} uuid A ID from the user
 * @param {string} count A number who will tell how many posts to fetch
 * @returns {Object} Object where all the Blogs that the User have. They are contained in an Array. If the User has no Blogs the Libary returns null instead. 
 */

module.exports = async function getUserBlogs(com, uid, count = '5') {
    let blogList = objs.profileBlogs;
    blogList.blogs = [];
    const sid = getConfig('sid');
    if (typeof sid != 'string' || typeof com !== 'string' || typeof uid !== 'string' || typeof count !== 'string') {
        throw new Error('All Arguments are not satisfied.');
    }
    try {
        const response = await fetch(endpoints.getUserBlogs(com, uid, count), {
            headers: {
                'NDCAUTH': `sid=${sid}`
            }
        });
        //Parsing the Response.
        const body = await response.json();
        if (body.blogList.length == 0) blogList.blogs = null;
        body.blogList.forEach((element) => {
            blogList.blogs.push(element);
        });
        blogList.status = 'ok';
        blogList.error = null;
    } catch (err) {
        blogList.error = err;
        throw 'Error while calling getUserBlogs: ' + err;
    }
    return blogList;
};