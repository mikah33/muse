import CreateCustomerForm from '@/components/admin/CreateCustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Create Customer Account</h1>
          <p className="text-gray-600">Set up a new customer with login credentials</p>
        </div>

        <CreateCustomerForm />
      </div>
    </div>
  )
}
