// BursaryApplicationList.jsx

import React, { useEffect, useState } from 'react';

export default function BursaryApplicationList() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('https://saleafapi-production.up.railway.app/api/BursaryApplication', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer your_token_here' // Replace with your actual token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setApplications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Bursary Applications</h2>
      {applications.length > 0 ? (
        applications.map((app, index) => <ApplicationCard key={index} application={app} />)
      ) : (
        <div>No applications found.</div>
      )}
    </div>
  );
}

function ApplicationCard({ application }) {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [accepted, setAccepted] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const handleAccept = async () => {
    const userId = application.appUserId;
    try {
      const response = await fetch(`https://saleafapi-production.up.railway.app/api/Account/assign-role/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer your_token_here' // Replace with your actual token
        },
        body: JSON.stringify({ role: 'student' })
      });

      if (!response.ok) {
        throw new Error('Failed to assign role');
      }

      setMessage('Bursary accepted and role assigned successfully.');
      setAccepted(true);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader} onClick={toggleExpanded}>
        <h3 style={styles.cardTitle}>
          {application.name} {application.surname}
        </h3>
        <button style={styles.expandButton}>{expanded ? 'Collapse' : 'Expand'}</button>
      </div>
      {expanded && (
        <div style={styles.cardContent}>
          {/* Personal Details */}
          <Section title="Personal Details">
            <Detail label="Full Name" value={`${application.name} ${application.surname}`} />
            <Detail label="Date of Birth" value={new Date(application.dateOfBirth).toLocaleDateString()} />
            <Detail label="SA ID Number" value={application.saidNumber} />
            <Detail label="Place of Birth" value={application.placeOfBirth} />
            <Detail label="Email" value={application.email} />
            <Detail label="Contact Number" value={application.contactNumber} />
            <Detail label="Home Physical Address" value={application.homePhysicalAddress} />
            <Detail label="Home Postal Address" value={application.homePostalAddress} />
          </Section>

          {/* Education Details */}
          <Section title="Education Details">
            <Detail label="Institution Applied For" value={application.institutionAppliedFor} />
            <Detail label="Degree or Diploma" value={application.degreeOrDiploma} />
            <Detail label="Year of Study and Commencement" value={application.yearOfStudyAndCommencement} />
            <Detail label="Student Number" value={application.studentNumber} />
            <Detail label="Approximate Funding Required" value={`R ${application.approximateFundingRequired}`} />
          </Section>

          {/* Documents */}
          <Section title="Documents">
            <Detail
              label="Tertiary Subjects and Results"
              value={
                <a href={application.tertiarySubjectsAndResultsUrl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              }
            />
            <Detail
              label="Grade 12 Subjects and Results"
              value={
                <a href={application.grade12SubjectsAndResultsUrl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              }
            />
            <Detail
              label="Grade 11 Subjects and Results"
              value={
                <a href={application.grade11SubjectsAndResultsUrl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              }
            />
          </Section>

          {/* Financial Details */}
          <Section title="Financial Details">
            {application.financialDetailsList.map((detail, index) => (
              <div key={index} style={styles.subSection}>
                <h4 style={styles.subSectionTitle}>{detail.role}</h4>
                <Detail label="Full Name" value={detail.fullName} />
                <Detail label="SA ID Number" value={detail.saidNumber} />
                <Detail label="Occupation" value={detail.occupation} />
                <Detail label="Marital Status" value={detail.maritalStatus} />
                <Detail label="Gross Monthly Income" value={`R ${detail.grossMonthlyIncome}`} />
                <Detail label="Other Income" value={`R ${detail.otherIncome}`} />
              </div>
            ))}
          </Section>

          {/* Dependents */}
          <Section title="Dependents">
            {application.dependents.map((dependent, index) => (
              <div key={index} style={styles.subSection}>
                <Detail label="Full Name" value={dependent.fullName} />
                <Detail label="Relationship" value={dependent.relationshipToApplicant} />
                <Detail label="Age" value={dependent.age} />
                <Detail label="Institution Name" value={dependent.institutionName} />
              </div>
            ))}
          </Section>

          {/* Assets */}
          <Section title="Assets">
            {/* Fixed Properties */}
            <SubSection title="Fixed Properties">
              {application.fixedProperties.map((property, index) => (
                <div key={index} style={styles.subSectionItem}>
                  <Detail label="Physical Address" value={property.physicalAddress} />
                  <Detail label="ERF No/Township" value={property.erfNoTownship} />
                  <Detail label="Date Purchased" value={property.datePurchased} />
                  <Detail label="Purchase Price" value={`R ${property.purchasePrice}`} />
                  <Detail label="Municipal Value" value={`R ${property.municipalValue}`} />
                  <Detail label="Present Value" value={`R ${property.presentValue}`} />
                </div>
              ))}
            </SubSection>

            {/* Vehicles */}
            <SubSection title="Vehicles">
              {application.vehicles.map((vehicle, index) => (
                <div key={index} style={styles.subSectionItem}>
                  <Detail label="Make/Model/Year" value={vehicle.makeModelYear} />
                  <Detail label="Registration Number" value={vehicle.registrationNumber} />
                  <Detail label="Present Value" value={`R ${vehicle.presentValue}`} />
                </div>
              ))}
            </SubSection>

            {/* Investments */}
            <SubSection title="Investments">
              {application.investments.map((investment, index) => (
                <div key={index} style={styles.subSectionItem}>
                  <Detail label="Company" value={investment.company} />
                  <Detail label="Description" value={investment.description} />
                  <Detail label="Market Value" value={`R ${investment.marketValue}`} />
                </div>
              ))}
            </SubSection>

            {/* Other Assets */}
            <Detail label="Jewellery Value" value={`R ${application.jewelleryValue}`} />
            <Detail label="Furniture and Fittings Value" value={`R ${application.furnitureAndFittingsValue}`} />
            <Detail label="Equipment Value" value={`R ${application.equipmentValue}`} />
            {application.otherAssets.map((asset, index) => (
              <div key={index} style={styles.subSectionItem}>
                <Detail label="Description" value={asset.description} />
                <Detail label="Value" value={`R ${asset.value}`} />
              </div>
            ))}
          </Section>

          {/* Liabilities */}
          <Section title="Liabilities">
            <Detail label="Overdrafts" value={`R ${application.overdrafts}`} />
            <Detail label="Unsecured Loans" value={`R ${application.unsecuredLoans}`} />
            <Detail label="Credit Card Debts" value={`R ${application.creditCardDebts}`} />
            <Detail label="Income Tax Debts" value={`R ${application.incomeTaxDebts}`} />
            {application.otherLiabilities.map((liability, index) => (
              <div key={index} style={styles.subSectionItem}>
                <Detail label="Description" value={liability.description} />
                <Detail label="Amount" value={`R ${liability.amount}`} />
              </div>
            ))}
          </Section>

          {/* Declaration */}
          <Section title="Declaration">
            <Detail label="Declaration Signed By" value={application.declarationSignedBy} />
            <Detail label="Declaration Date" value={new Date(application.declarationDate).toLocaleDateString()} />
          </Section>

          {/* Accept Button */}
          {!accepted && (
            <button style={styles.acceptButton} onClick={handleAccept}>
              Accept Application
            </button>
          )}
          {message && <p style={styles.message}>{message}</p>}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div style={styles.subSection}>
      <h4 style={styles.subSectionTitle}>{title}</h4>
      {children}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={styles.detail}>
      <strong>{label}:</strong> {value}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '30px'
  },
  loading: {
    fontSize: '24px',
    textAlign: 'center',
    marginTop: '50px'
  },
  error: {
    fontSize: '24px',
    textAlign: 'center',
    marginTop: '50px',
    color: 'red'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '20px',
    overflow: 'hidden'
  },
  cardHeader: {
    backgroundColor: '#f7f7f7',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  },
  cardTitle: {
    margin: 0,
    fontSize: '20px'
  },
  expandButton: {
    padding: '8px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: '#004f99',
    color: '#fff',
    border: 'none',
    borderRadius: '4px'
  },
  cardContent: {
    padding: '15px'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '5px',
    marginBottom: '10px'
  },
  subSection: {
    marginBottom: '15px',
    paddingLeft: '15px'
  },
  subSectionTitle: {
    fontSize: '16px',
    marginBottom: '10px'
  },
  subSectionItem: {
    marginBottom: '10px',
    paddingLeft: '10px'
  },
  detail: {
    marginBottom: '5px'
  },
  acceptButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745', // Green color
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px'
  },
  message: {
    marginTop: '10px',
    color: '#28a745' // Green color for success message
  }
};
