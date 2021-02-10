var _ = require('lodash');
const moment = require('moment');
const toDoModel = require('../models/toDoModel');
const config = require('../config')
var jwt = require('jsonwebtoken');


exports.addTask = async (req, res) => {
    try {
        const payload = req.body;
        const { title, details } = payload;
        const { token } = req.headers;
        let decoded = jwt.verify(token, config.JWT_SECERT_KEY);

        const { user_id } = decoded;

        if (_.isUndefined(title) || _.isUndefined(details) || _.isNull(title) || _.isNull(details))
            res.send({
                code: 400,
                message: "wrong payload"
            })

        let response = await toDoModel.insertTask(title, user_id, details);
        if (_.isEmpty(response))
            res.send({
                code: 400,
                message: "Something Went wrong"
            })
        else
            res.send({
                code: 200,
                message: "Task Added successfully"
            })
    } catch (error) {
        res.send({
            code: 500,
            message: "Internal Server Error"
        })
        throw error;
    }
}

exports.markTaskComplete = async (req, res) => {
    try {
        const payload = req.body;
        const { dateOfCompletion } = payload;
        const { token } = req.headers;
        const { taskId } = req.params;
        let decoded = jwt.verify(token, config.JWT_SECERT_KEY);
        const { user_id } = decoded;
        if (_.isUndefined(dateOfCompletion) || _.isNull(dateOfCompletion))
            res.send({
                code: 400,
                message: "wrong payload"
            })
        let formattedDate = moment(dateOfCompletion).format('YYYY-MM-DD');
        let response = await toDoModel.updatetTaskStatus('1', taskId, formattedDate);
        if (_.isEmpty(response))
            res.send({
                code: 400,
                message: "Something Went wrong"
            })
        else
            res.send({
                code: 200,
                message: "Task Updated successfully"
            })

    } catch (error) {
        res.send({
            code: 500,
            message: "Internal Server Error"
        })
        throw error;
    }
}

exports.markTaskDeleted = async (req, res) => {
    try {
        const { token } = req.headers;
        const { taskId } = req.params;
        let decoded = jwt.verify(token, config.JWT_SECERT_KEY);
        let taskDetails = await toDoModel.getTaskDetailsById(Number(taskId));
        let responseMessage = "";
        let responseCode = 400;
        if (_.isEmpty(taskDetails)) {
            responseMessage = "Wrong Task Id"
        }
        else if (taskDetails[0].is_completed == '1') {
            responseMessage = "You can't delete a completed task"
        }
        else {
            let deleteTaskResponse = await toDoModel.markTaskDeletedById(Number(taskId));

            if (_.isEmpty(deleteTaskResponse))
                responseMessage = "Something Went wrong";
            else {
                responseMessage = "Task Deleted successfully"
                responseCode = 200;
            }
        }
        res.send({
            code: responseCode,
            message: responseMessage
        })
    } catch (error) {
        res.send({
            code: 500,
            message: "Internal Server Error"
        })
        throw error;
    }
}

exports.listAllTask = async (req, res) => {
    try {
        const { token } = req.headers;
        let decoded = jwt.verify(token, config.JWT_SECERT_KEY);
        const { user_id } = decoded;
        const payload = req.body;
        let { startDate, endDate } = payload;

        let responseCode = 400;
        let responseMessage = "";

        if (_.isEmpty(startDate))
            startDate = moment().format('YYYY-MM-DD')

        if (_.isEmpty(endDate))
            endDate = moment().format('YYYY-MM-DD')

        let response = toDoModel.getTaskListByUser(user_id, startDate, endDate);
        responseCode = 200
        res.send({
            code: responseCode,
            message: "Data Fetched Succsessfully",
            data: response
        })



    } catch (error) {
        throw error;
    }
}