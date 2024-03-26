const xmlrpc = require('xmlrpc');
const { authenticateOdoo } = require('../middlewares/authMiddleware');

const url = '20.164.146.60';
const db = 'bitnami_odoo';
const password = 'FKOF4pOJIV';

const client = xmlrpc.createClient({ host: url, port: 80, path: '/xmlrpc/2/object' });

// {
//   "applicant_id": 4,
//   "interview_data": {
//     "datetime": "2024-04-01 10:00:00",
//     "location": "Office E",
//     "description": "Technical interview with candidate"
//   },
//   "calendar_event_data": {
//     "name": "Interview with Wilson Kumalo",
//     "partner_ids": [[4, 4]], // Replace 123 with the actual applicant ID
//     "start": "2024-04-01 10:00:00", // Use datetime for event start
//     "stop": "2024-04-01 16:00:00", // Use datetime for event end
//     "location": "Office E",
//     "description": "Technical interview with candidate"
//     // Add other calendar event fields if needed
//   }
// }




async function scheduleInterview(req, res) {
  try {
    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    const { applicant_id, interview_data } = req.body;
    if (!applicant_id || !interview_data) {
      return res.status(400).json({ success: false, error: 'Invalid request data. Both applicant_id and interview_data are required.' });
    }

    client.methodCall('execute_kw', [db, uid, password, 'calendar.event', 'create', [{
      'name': 'Interview with Applicant',
      'partner_ids': [(4, applicant_id)], // Add the applicant as an attendee
      'start': interview_data.datetime, // Use datetime for event start
      'stop': interview_data.datetime, // Use datetime for event end
      'location': interview_data.location,
      'description': interview_data.description
      // Add other event fields here if needed
    }]], (error, value) => {
      if (error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.status(200).json({ success: true, event_id: value });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


// {
//   "id": 9,
//   "interview_data": {
//     "datetime": "2024-04-01 11:00:00",
//     "location": "Office Q",
//     "description": "Updated interview details"
//   }
// }


async function updateInterview(req, res) {
  try {
    const { interview_data, id } = req.body;

    if (!id || !interview_data) {
      return res.status(400).json({ success: false, error: 'Invalid request data. Both id and interview_data are required.' });
    }

    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    client.methodCall('execute_kw', [db, uid, password, 'calendar.event', 'write', [[id], {
      'name': 'Updated Interview Details',
      'start': interview_data.datetime, // Updated datetime for event start
      'stop': interview_data.datetime, // Updated datetime for event end
      'location': interview_data.location,
      'description': interview_data.description
      // Add other updated event fields here if needed
    }]], (error, value) => {
      if (error) {
        res.status(500).json({ success: false, error: error.message });
      } else {
        res.status(200).json({ success: true, message: 'Interview details updated successfully.' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function cancelInterview(req, res) {
  try {
    const { id } = req.params;

    const uid = await authenticateOdoo();
    if (!uid) {
      return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
    }

    client.methodCall('execute_kw', [db, uid, password, 'calendar.event', 'unlink', [[parseInt(id)]]], (error, value) => {
      if (error) {
        console.error('Error deleting interview:', error);
        res.status(500).json({ success: false, error: error.message });
      } else {
        console.log('Interview deleted successfully:', id);
        res.status(200).json({ success: true, message: 'Interview canceled successfully.' });
      }
    });
  } catch (error) {
    console.error('Exception in cancel interview endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getInterviews(req, res) {
    try {
      const uid = await authenticateOdoo();
      if (!uid) {
        return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
      }
  
      // Update the search domain to fetch events that are interviews
      const searchParams = [['name', 'ilike', 'Interview']]; // Example search criteria
  
      const fields = ['id', 'name', 'start', 'stop', 'location', 'description'];
  
      client.methodCall('execute_kw', [db, uid, password, 'calendar.event', 'search_read', [searchParams], { fields }], (error, value) => {
        if (error) {
          console.error('Error fetching interviews from Odoo:', error); // Log detailed error message
          return res.status(500).json({ success: false, error: 'Error fetching interviews from Odoo. Check server logs for more details.' });
        } else {
          return res.status(200).json({ success: true, interviews: value });
        }
      });
    } catch (error) {
      console.error('Exception in get interviews endpoint:', error); // Log exception details
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  }
  
  

  async function getInterviewById(req, res) {
    try {
      const { id } = req.params;
  
      const uid = await authenticateOdoo();
      if (!uid) {
        return res.status(401).json({ success: false, error: 'Authentication failed. Please check your credentials.' });
      }
  
      client.methodCall('execute_kw', [db, uid, password, 'calendar.event', 'search_read', [[['id', '=', parseInt(id)]]], { fields: ['id', 'name', 'start', 'stop', 'location', 'description'] }], (error, value) => {
        if (error) {
          console.error('Error fetching interview by ID:', error);
          return res.status(500).json({ success: false, error: 'Error fetching interview from Odoo.' });
        } else {
          if (value.length === 0) {
            return res.status(404).json({ success: false, error: 'Interview not found.' });
          } else {
            return res.status(200).json({ success: true, interview: value[0] });
          }
        }
      });
    } catch (error) {
      console.error('Exception in get interview by ID endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error.' });
    }
  }
  

module.exports = { scheduleInterview, updateInterview, cancelInterview, getInterviews, getInterviewById };
