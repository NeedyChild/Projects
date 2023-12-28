import axios from "axios";

const REST_API_BASEURL = 'http://localhost:8080/api/employees';

export const listEmployees = () => {
    return axios.get(REST_API_BASEURL);
}

export const createEmployee = (employee) => {
    return axios.post(REST_API_BASEURL, employee);
}

export const getEmployee = (employeeId) => {
    return axios.get(REST_API_BASEURL + '/' + employeeId);
}

export const updateEmployee = (employeeId, employee) => {
    return axios.put(REST_API_BASEURL + '/' + employeeId, employee);
}

export const deleteEmployee = (employeeId) => {
    return axios.delete(REST_API_BASEURL + '/' + employeeId);
}