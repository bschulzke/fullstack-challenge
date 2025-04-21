import { useState, useEffect } from 'react';
import { Organization } from '../../shared/models/Organization';
import { DealStatus } from '../../shared/models/Deal';
import './index.css';

function App() {
  const [organizations, setOrganizations] = useState<Organization[] | null>(null);
  const [filters, setFilters] = useState({
    account: '',
    dealName: '',
    dealValue: '',
    dealStatus: '',
    startYear: '',
    endYear: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3500/organizations');
        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.map(Organization.fromJson));
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const filteredOrganizations = organizations
    ? organizations.map((org) => ({
        ...org,
        accounts: org.accounts.filter((account) => 
          account.name.toLowerCase().includes(filters.account.toLowerCase())
        ).map((account) => ({
          ...account,
          deals: account.deals.filter((deal) => {
            console.log(deal);
            const dealStartYear = deal.start_date.getFullYear();
            const dealEndYear = deal.end_date.getFullYear();

            const filterStartYear = filters.startYear ? parseInt(filters.startYear) : null;
            const filterEndYear = filters.endYear ? parseInt(filters.endYear) : null;
            console.log("deal start year", dealStartYear);
            console.log("filterStartYear", filterStartYear);

            return (
              deal.name.toLowerCase().includes(filters.dealName.toLowerCase()) &&
              (filters.dealValue ? deal.value === Number(filters.dealValue) : true) &&
              (filters.dealStatus ? deal.status === filters.dealStatus : true) &&
              (filterStartYear ? dealStartYear === filterStartYear : true) &&
              (filterEndYear ? dealEndYear === filterEndYear : true)
            );
          })
        }))
      }))
    : [];

  return (
    <div className="container">
      <h2 className="header">Organizations</h2>

      <div className="filters">
        <input
          type="text"
          name="account"
          placeholder="Filter by account name"
          value={filters.account}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="dealName"
          placeholder="Filter by deal name"
          value={filters.dealName}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="number"
          name="dealValue"
          placeholder="Filter by deal value"
          value={filters.dealValue}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select
          name="dealStatus"
          value={filters.dealStatus}
          onChange={handleFilterChange}
          className="filter-input"
        >
          <option value="">Select deal status</option>
          {Object.values(DealStatus).map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <input
          type="number"
          name="startYear"
          placeholder="Filter by start year"
          value={filters.startYear}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="number"
          name="endYear"
          placeholder="Filter by end year"
          value={filters.endYear}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>

      {filteredOrganizations.length > 0 ? (
        filteredOrganizations.map((org) => (
          <div key={org.organization_id} className="organization">
            <h3 className="organization-name">{org.name}</h3>
            {org.accounts.map((account) => (
              <div key={account.account_id} className="account-card">
                <h4 className="account-name">{account.name}</h4>
                {account.deals.length > 0 ? (
                  <table className="deals-table">
                    <thead>
                      <tr>
                        <th className="table-header">Name</th>
                        <th className="table-header">Value</th>
                        <th className="table-header">Status</th>
                        <th className="table-header">Start Year</th>
                        <th className="table-header">End Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {account.deals.map((deal, index) => (
                        <tr
                          key={deal.deal_id}
                          className={`deal-row ${index % 2 === 0 ? 'even' : 'odd'}`}
                        >
                          <td className="table-cell">{deal.name}</td>
                          <td className="table-cell">${deal.value}</td>
                          <td className="table-cell">{deal.status}</td>
                          <td className="table-cell">{deal.start_date.getFullYear()}</td>
                          <td className="table-cell">{deal.end_date.getFullYear()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-deals">No deals</p>
                )}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No organizations or accounts match your filters.</p>
      )}
    </div>
  );
}

export default App;
