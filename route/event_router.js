'use strict';

const express = require('express');
const bodyParser = require('body-parser').json();
const Event = require('../model/event.js');
const Job = require('../model/job.js');
const errorHandle = require('../lib/error_handler.js');

const eventRouter = module.exports = express.Router();

eventRouter.post('/jobs/events', bodyParser, (req,res) => {
  let newEvent = new Event(req.body);
  newEvent.save((err, events) => {
    if(err) return errorHandle(err,res);
    res.json(events);
  });
});

eventRouter.get('/jobs/events/active', (req,res) => {
  let jobsArray = [];
  Job.find({isArchived: false}, (err, jobs) => {
    if (err) return errorHandle(err, res);
    console.log(jobs);
    jobsArray.push(jobs._id);
    Event.find()
    .where('jobId')
    .in(jobsArray)
    .exec(function(err,jobs){
      console.log('in exec', err);
      res.json({Events: jobs});
    });
  });
});
eventRouter.put('/jobs/events', bodyParser, (req,res) => {
  Event.findOneAndUpdate({_id:req.body._id}, req.body, (err,events) => {
    if(err) return errorHandle(err,res);
    res.json({message: 'You have successfully updated event', data:events});
  });
});

eventRouter.delete('/jobs/events/:id', (req,res) => {
  Event.findOneAndRemove({_id:req.params.id}, null, (err,events) => {
    if(err) return errorHandle(err,res);
    res.json({message: 'You have successfully deleted event', data:events});
  });
});
