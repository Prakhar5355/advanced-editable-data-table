const FIRST_NAMES = ['Alice', 'Bob', 'Carol', 'David', 'Elena', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack', 'Kira', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tara', 'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zoe'];
const LAST_NAMES = ['Anderson', 'Brown', 'Chen', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Ivanov', 'Jones', 'Kim', 'Lee', 'Martinez', 'Nelson', 'Ortiz', 'Patel', 'Quinn', 'Rivera', 'Smith', 'Torres', 'Ueda', 'Vance', 'Wang', 'Xavier', 'Young', 'Zhang'];
const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Legal', 'Support'];
const ROLES = ['Engineer', 'Manager', 'Director', 'Analyst', 'Specialist', 'Lead', 'Coordinator', 'Associate', 'VP', 'Intern'];
const STATUSES = ['Active', 'Inactive', 'On Leave', 'Remote', 'Contract'];
const LOCATIONS = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Toronto', 'Singapore', 'Dubai', 'Amsterdam'];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generateDataset(count = 10000) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const firstName = rand(FIRST_NAMES);
    const lastName = rand(LAST_NAMES);
    rows.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 999)}@company.io`,
      department: rand(DEPARTMENTS),
      role: rand(ROLES),
      salary: randInt(40000, 220000),
      age: randInt(22, 62),
      performance: randFloat(1.0, 5.0, 1),
      location: rand(LOCATIONS),
      status: rand(STATUSES),
      startDate: new Date(randInt(2010, 2024), randInt(0, 11), randInt(1, 28)).toISOString().split('T')[0],
      projects: randInt(1, 25),
    });
  }
  return rows;
}

export const COLUMN_DEFS = [
  { key: 'id',          label: 'ID',           type: 'number',  width: 70,  editable: false },
  { key: 'name',        label: 'Name',         type: 'text',    width: 180, editable: true },
  { key: 'email',       label: 'Email',        type: 'text',    width: 230, editable: true },
  { key: 'department',  label: 'Department',   type: 'text',    width: 140, editable: true },
  { key: 'role',        label: 'Role',         type: 'text',    width: 130, editable: true },
  { key: 'salary',      label: 'Salary ($)',   type: 'number',  width: 120, editable: true },
  { key: 'age',         label: 'Age',          type: 'number',  width: 80,  editable: true },
  { key: 'performance', label: 'Perf.',        type: 'number',  width: 90,  editable: true },
  { key: 'location',    label: 'Location',     type: 'text',    width: 140, editable: true },
  { key: 'status',      label: 'Status',       type: 'text',    width: 110, editable: true },
  { key: 'startDate',   label: 'Start Date',   type: 'text',    width: 120, editable: true },
  { key: 'projects',    label: 'Projects',     type: 'number',  width: 90,  editable: true },
];
