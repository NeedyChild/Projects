import './App.css'
import DepartmentComponent from './components/DepartmentComponent'
import EmployeeComponent from './components/EmployeeComponent'
import FooterComponent from './components/FooterComponent'
import HeaderComponent from './components/HeaderComponent'
import ListDepartmentComponent from './components/ListDepartmentComponent'
import ListEmployeeComponent from './components/ListEmployeeComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
          <Routes>
            // http://localhost:3000
            <Route path='/' element = { <ListEmployeeComponent></ListEmployeeComponent> }></Route>

            // http://localhost:3000/employees
            <Route path='/employees' element = { <ListEmployeeComponent /> }></Route>

            // http://localhost:3000/add-employee
            <Route path='/add-employee' element = { <EmployeeComponent /> }></Route>

            // http://localhost:3000/update-employee/#id-number
            <Route path='/update-employee/:id' element = { <EmployeeComponent /> }></Route>

            // http://localhost:3000/departments
            <Route path='/departments' element = { < ListDepartmentComponent /> }></Route>

            <Route path='add-department' element = { <DepartmentComponent /> }></Route>

            <Route path='update-department/:id' element = { <DepartmentComponent /> }></Route>
          </Routes>
        <FooterComponent />
      </BrowserRouter>
    </>
  )
}

export default App
