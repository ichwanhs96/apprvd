interface Contract {
    name: string;
    language: string;
    version: string;
    created: string;
    updated: string;
    status: string;
}

interface ContractItem {
    contract: Contract;
}

function ContractItem(contractItem: ContractItem) {
    const getStatusClass = (status: string) => {
      switch (status) {
        case 'Uploading':
          return 'bg-blue-100 text-blue-700';
        case 'Drafting':
          return 'bg-yellow-100 text-yellow-700';
        case 'Finalized':
          return 'bg-green-100 text-green-700';
        default:
          return '';
      }
    };
  
    return (
      <tr className="border-b">
        <td className="px-4 py-8 text-gray-700">{contractItem.contract.name}</td>
        <td className="px-4 py-8 text-gray-700">{contractItem.contract.language}</td>
        <td className="px-4 py-8 text-gray-700">{contractItem.contract.version}</td>
        <td className="px-4 py-8 text-gray-700">{contractItem.contract.created}</td>
        <td className="px-4 py-8 text-gray-700">{contractItem.contract.updated}</td>
        <td className="px-4 py-8 text-gray-700">
          <span className={`px-4 py-2 rounded-3xl ${getStatusClass(contractItem.contract.status)}`}>
            {contractItem.contract.status}
          </span>
        </td>
      </tr>
    );
  }

function ContractList() {
    const contracts: Contract[] = [
        { name: 'Draft Service Agreement Apprvd', language: 'EN', version: 'First draft', created: '5 Aug, 10:02AM', updated: 'Today, 08:00AM', status: 'Uploading' },
        { name: 'NDA John Doe', language: 'EN', version: 'Draft v1', created: '5 Aug, 10:02AM', updated: 'Today, 08:00AM', status: 'Drafting' },
        { name: 'MSA Accounting Vendor Italy', language: 'IT', version: 'v2.2', created: '01 Aug, 08:59AM', updated: 'Aug 2, 11:01AM', status: 'Finalized' },
    ];

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">Language</th>
                <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">Version</th>
                <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">Created</th>
                <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">Updated</th>
                <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract, index) => (
                    <ContractItem key={index} contract={contract} />
                ))}
            </tbody>
        </table>
        </div>
    );
}

function ContractsPage() {
    return (
        <div className="flex-1 p-8">
            <h1 className="mb-8 text-4xl font-bold">
                Contracts
            </h1>
            <div className="flex justify-between items-center mb-5">
                <div>
                <button className="bg-green-500 text-white px-4 py-2 rounded-3xl mr-3">Create new</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-3xl">Upload existing</button>
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="border px-3 py-2 rounded bg-white"
                />
            </div>
            <ContractList />
        </div>  
    );
}

export default ContractsPage;