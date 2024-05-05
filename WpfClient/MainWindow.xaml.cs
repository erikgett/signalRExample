using Microsoft.AspNetCore.SignalR.Client;
using System.Windows;

namespace WpfClient
{
    public partial class MainWindow : Window
    {
        private readonly HubConnection _connection;

        public MainWindow()
        {
            _connection = new HubConnectionBuilder()
                .WithUrl("https://localhost:7207/chatHub")  // Обновите URL в соответствии с вашими настройками
                .Build();
            InitializeComponent();
            Loaded += MainWindow_Loaded;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            _connection.On<string, string>("ReceiveMessage", (user, message) =>
            {
                this.Dispatcher.Invoke(() =>
                {
                    var newMessage = $"{user}: {message}";
                    MessagesList.Items.Add(newMessage);
                });
            });

            try
            {
                await _connection.StartAsync();
            }
            catch (Exception ex)
            {
                MessagesList.Items.Add($"Connection error: {ex.Message}");
            }
        }

        private async void Send_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                await _connection.InvokeAsync("SendMessage", UserInput.Text, MessageInput.Text);
                MessageInput.Clear();
            }
            catch (Exception ex)
            {
                MessagesList.Items.Add($"Send error: {ex.Message}");
            }
        }
    }
}