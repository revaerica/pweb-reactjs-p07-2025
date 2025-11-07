interface EmptyStateProps {
  message?: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No data available',
  icon = '📭',
}) => {
  return (
    <div className="empty-container">
      <div className="empty-icon">{icon}</div>
      <p className="empty-message">{message}</p>
    </div>
  );
};

export default EmptyState;
